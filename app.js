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

    // Botão guia 🛒
    const btnGuia = document.createElement("button");
    btnGuia.textContent = "🛒";
    btnGuia.title = "Abrir guia de compras";

    const itensLista = JSON.parse(localStorage.getItem(`itens-${lista}`)) || [];
    if (itensLista.length === 0) {
      btnGuia.disabled = true;
      btnGuia.style.opacity = "0.4";
      btnGuia.style.cursor = "default";
    } else {
      btnGuia.onclick = () => {
        selecionarLista(lista);
        window.location.href = "guia.html";
      };
    }

    li.appendChild(btnGuia);

    // Botão excluir 🗑️
    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "🗑️";
    btnExcluir.title = "Excluir lista";
    btnExcluir.style.marginLeft = "0.4rem";
    btnExcluir.onclick = () => excluirLista(index);
    li.appendChild(btnExcluir);

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
  const confirmar = confirm(`Tem certeza que deseja excluir a lista "${nome}"?`);
  if (!confirmar) return;

  localStorage.removeItem(`itens-${nome}`);
  listas.splice(index, 1);
  localStorage.setItem("listas", JSON.stringify(listas));
  renderizarListas();
}

function selecionarLista(nome) {
  localStorage.setItem("listaSelecionada", nome);
}

renderizarListas();

window.adicionarLista = adicionarLista;
window.selecionarLista = selecionarLista;
window.excluirLista = excluirLista;

if (window.location.pathname.includes("lista.html")) {
  const titulo = document.getElementById("tituloLista");
  const itensContainer = document.getElementById("itensContainer");
  const botaoVoz = document.querySelector(".add-voz button");
  const botaoImagem = document.getElementById("uploadImagem");
  const listaSelecionada = localStorage.getItem("listaSelecionada");

  let itens = JSON.parse(localStorage.getItem(`itens-${listaSelecionada}`)) || [];

  if (titulo) titulo.textContent = listaSelecionada;
  if (botaoImagem) botaoImagem.style.display = "none";

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

  function iniciarReconhecimento() {
    if (!navigator.onLine) {
      alert("A entrada por voz precisa de conexão com a internet para funcionar.");
      return;
    }

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
      const numeros = {
        "uma": 1, "um": 1, "duas": 2, "dois": 2, "três": 3,
        "quatro": 4, "cinco": 5, "seis": 6, "sete": 7, "oito": 8,
        "nove": 9, "dez": 10
      };

      let fraseSeparada = resultado.replace(
        /\b(uma|um|duas|dois|três|quatro|cinco|seis|sete|oito|nove|dez|\d+)\b/g,
        ", $1"
      );

      const blocos = fraseSeparada.split(",").map(b => b.trim()).filter(b => b);

      blocos.forEach(bloco => {
        const partes = bloco.split(" ");
        if (partes.length === 0) return;

        let qtd = numeros[partes[0]] || parseInt(partes[0]) || 1;
        let nome = partes.slice(1).filter(p => p !== "e").join(" ");

        if (nome.length > 0) {
          adicionarItem(nome, qtd);
        }
      });

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
    location.href = "./index.html";
  }

  renderizarItens();

  window.adicionarItem = adicionarItem;
  window.excluirItem = excluirItem;
  window.voltar = voltar;
  window.alterarQuantidade = alterarQuantidade;
  window.iniciarReconhecimento = iniciarReconhecimento;
}
