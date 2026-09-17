// Helpers visuais comuns. Os IDs mantêm o contrato dos quatro geradores.
// Persistência de tema, validação e estado das operações pertencem a cada página.

function mostrarAlerta(msg, tipo = "info") {
  const titulos = { info: "Aviso", success: "Sucesso", error: "Erro", warning: "Atenção" };
  const box = document.getElementById("customAlert");
  box.className = "proad-toast" + (tipo === "info" ? "" : " proad-toast--" + tipo);
  document.getElementById("alertTitle").textContent = titulos[tipo] || titulos.info;
  document.getElementById("alertMessage").textContent = msg;
  box.hidden = false;
  clearTimeout(window.timerAlerta);
  if (tipo !== "error") window.timerAlerta = setTimeout(fecharAlerta, 4500);
}

function fecharAlerta() {
  clearTimeout(window.timerAlerta);
  document.getElementById("customAlert").hidden = true;
}

function definirStatus(texto) {
  document.getElementById("document-status").textContent = texto;
}

function definirErroCampo(id, mensagem) {
  const campo = document.getElementById(id);
  const erro = document.getElementById(id + "-erro");
  campo.setAttribute("aria-invalid", String(Boolean(mensagem)));
  erro.textContent = mensagem;
  erro.hidden = !mensagem;
}

function atualizarBotaoTema() {
  document.getElementById("tema-toggle").setAttribute("aria-pressed", String(document.body.classList.contains("dark-mode")));
  document.getElementById("tema-toggle").textContent =
    document.body.classList.contains("dark-mode")
      ? "Modo claro"
      : "Modo escuro";
}
