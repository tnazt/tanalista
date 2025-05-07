// -------------------------
// TELA PRINCIPAL - index.html
// -------------------------

let listas = JSON.parse(localStorage.getItem("listas")) || [];

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

// -------------------------
// TELA DE ITENS - lista.html
// -------------------------

if (window.location.pathname.includes("lista.html")) {
  const titulo = document.getElementById("tituloLista");
  const itensContainer = document.getElementById("itensContainer");
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

  function adicionarItem() {
    const input = document.getElementById("novoItemInput");
    const texto = input.value.trim();
    if (texto) {
      itens.push({ nome: texto, quantidade: 1 });
      localStorage.setItem(`itens-${listaSelecionada}`, JSON.stringify(itens));
      input.value = "";
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

  function voltar() {
    window.location.href = "index.html";
  }

  renderizarItens();

  // Expor funções para o HTML
  window.adicionarItem = adicionarItem;
  window.excluirItem = excluirItem;
  window.voltar = voltar;
  window.alterarQuantidade = alterarQuantidade;
}
