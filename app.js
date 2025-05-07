// app.js

let listas = JSON.parse(localStorage.getItem("listas")) || [];
let gravando = false;
let recognition;

function renderizarListas() {
  const container = document.getElementById("listasContainer");
  if (!container) return;

  container.innerHTML = "";
  listas.forEach((lista, index) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "lista.html";
    link.textContent = lista;
    link.onclick = () => selecionarLista(lista);
    li.appendChild(link);

    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    btn.onclick = () => excluirLista(index);
    li.appendChild(btn);

    container.appendChild(li);
  });
}

function adicionarLista() {
  const input = document.getElementById("novaListaInput");
  if (!input) return;

  const nome = input.value.trim();
  if (nome) {
    listas.push(nome);
    localStorage.setItem("listas", JSON.stringify(listas));
    input.value = "";
    renderizarListas();
  }
}

function excluirLista(index) {
  const nome = listas[index];
  localStorage.removeItem(`itens-${nome}`);
  listas.splice(index, 1);
  localStorage.setItem("listas", JSON.stringify(listas));
  renderizarListas();
}

function selecionarLista(nome) {
  localStorage.setItem("listaSelecionada", nome);
}

renderizarListas();

if (window.location.pathname.includes("lista.html")) {
  const titulo = document.getElementById("tituloLista");
  const itensContainer = document.getElementById("itensContainer");
  const botaoVoz = document.querySelector(".add-voz button");
  const listaSelecionada = localStorage.getItem("listaSelecionada");

  let itens = JSON.parse(localStorage.getItem(`itens-${listaSelecionada}`)) || [];

  if (titulo) titulo.textContent = listaSelecionada;

  function renderizarItens() {
    itensContainer.innerHTML = "";
    itens.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.nome}</span>
        <div class="quantidade">
          <button onclick="alterarQuantidade(${index}, -1)">−</button>
          <span>${item.quantidade}</span>
          <button onclick="alterarQuantidade(${index}, 1)">+</button>
          <button onclick="excluirItem(${index})">🗑️</button>
        </div>
      `;
      itensContainer.appendChild(li);
    });
  }

  function adicionarItem(nomeItem, quantidade = 1) {
    const input = document.getElementById("novoItemInput");
    const texto = nomeItem || input.value.trim();
    if (texto) {
      itens.push({ nome: texto, quantidade });
      localStorage.setItem(`itens-${listaSelecionada}`, JSON.stringify(itens));
      if (!nomeItem) input.value = "";
      renderizarItens();
    }
  }

  function excluirItem(index) {
    itens.splice(index, 1);
    localStorage.setItem(`itens-${listaSelecionada}`, JSON.stringify(itens));
    renderizarItens();
  }

  function alterarQuantidade(index, delta) {
    itens[index].quantidade += delta;
    if (itens[index].quantidade < 1) {
      itens[index].quantidade = 1;
    }
    localStorage.setItem(`itens-${listaSelecionada}`, JSON.stringify(itens));
    renderizarItens();
  }

  function carregarImagem(file) {
    if (!file) return;

    const canvas = document.getElementById("canvasOCR");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const value = avg < 150 ? 0 : 255;
        data[i] = data[i + 1] = data[i + 2] = value;
      }
      ctx.putImageData(imageData, 0, 0);

      processarImagem(canvas.toDataURL());
    };
    img.src = URL.createObjectURL(file);
  }

  function processarImagem(imageBase64) {
    Tesseract.recognize(imageBase64, 'por', {
      logger: m => console.log(m)
    }).then(({ data: { text } }) => {
      const linhas = text.split("\n").map(l => l.trim()).filter(l =>
        l.length >= 3 && /^[a-zA-Zá-úÁ-ÚçÇ\s]+$/.test(l)
      );
      linhas.forEach(linha => {
        itens.push({ nome: linha, quantidade: 1 });
      });
      localStorage.setItem(`itens-${listaSelecionada}`, JSON.stringify(itens));
      renderizarItens();
      alert("Itens adicionados com sucesso!");
    }).catch(err => {
      console.error("Erro no OCR:", err);
      alert("Erro ao processar imagem.");
    });
  }

  function iniciarReconhecimento() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      gravando = true;
      botaoVoz.textContent = "🔴 Gravando... (clique para parar)";
      botaoVoz.style.background = "#ff5252";
    };

    recognition.onresult = function(event) {
      const resultado = event.results[0][0].transcript.toLowerCase();
      const padrao = /(?:uma|um|dois|duas|três|quatro|cinco|seis|sete|oito|nove|dez|\d+)?\s*([a-zA-Zãõçáéíóúàêâôûü\s]+)/g;
      const numeros = {
        "uma": 1, "um": 1, "duas": 2, "dois": 2, "três": 3,
        "quatro": 4, "cinco": 5, "seis": 6, "sete": 7, "oito": 8,
        "nove": 9, "dez": 10
      };

      let match;
      while ((match = padrao.exec(resultado)) !== null) {
        let partes = match[0].trim().split(" ");
        let qtd = numeros[partes[0]] || parseInt(partes[0]) || 1;
        let nome = partes.slice(isNaN(qtd) ? 0 : 1).join(" ");
        adicionarItem(nome, qtd);
      }
      recognition.stop();
    };

    recognition.onerror = function(event) {
      console.error("Erro no reconhecimento de voz:", event.error);
      alert("Erro ao reconhecer a voz. Tente novamente.");
      recognition.stop();
    };

    recognition.onend = function() {
      gravando = false;
      botaoVoz.textContent = "🎤 Adicionar por voz";
      botaoVoz.style.background = "var(--button-bg)";
    };

    recognition.start();
  }

  function voltar() {
    window.location.href = "index.html";
  }

  renderizarItens();

  window.adicionarItem = adicionarItem;
  window.excluirItem = excluirItem;
  window.voltar = voltar;
  window.alterarQuantidade = alterarQuantidade;
  window.carregarImagem = carregarImagem;
  window.iniciarReconhecimento = iniciarReconhecimento;
}
