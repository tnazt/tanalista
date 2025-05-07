let listas = JSON.parse(localStorage.getItem("listas")) || [];

function renderizarListas() {
  const container = document.getElementById("listasContainer");
  container.innerHTML = "";
  listas.forEach((lista, index) => {
    const li = document.createElement("li");
    li.textContent = lista;
    const btn = document.createElement("button");
    btn.textContent = "🗑️";
    btn.onclick = () => excluirLista(index);
    li.appendChild(btn);
    container.appendChild(li);
  });
}

function adicionarLista() {
  const input = document.getElementById("novaListaInput");
  const nome = input.value.trim();
  if (nome) {
    listas.push(nome);
    localStorage.setItem("listas", JSON.stringify(listas));
    input.value = "";
    renderizarListas();
  }
}

function excluirLista(index) {
  listas.splice(index, 1);
  localStorage.setItem("listas", JSON.stringify(listas));
  renderizarListas();
}

renderizarListas();
