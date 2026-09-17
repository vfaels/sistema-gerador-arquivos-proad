// Helpers visuais comuns. Os IDs mantêm o contrato dos quatro geradores.
// Persistência de tema, validação e estado das operações pertencem a cada página.

let focoAntesAlerta;

function focoDisponivel(elemento) {
  return elemento && elemento !== document.body && elemento !== document.documentElement &&
    elemento.isConnected && !elemento.disabled && !elemento.closest('[inert]') &&
    elemento.getClientRects().length && getComputedStyle(elemento).visibility !== "hidden";
}

// Restaurar só quando o navegador perdeu o foco ao desabilitar o controle.
function preservarFocoOperacao() {
  const anterior = document.activeElement;
  return () => {
    if ((document.activeElement === document.body || document.activeElement === anterior) && focoDisponivel(anterior)) {
      anterior.focus({ preventScroll: true });
      if (focoAntesAlerta === document.body) focoAntesAlerta = anterior;
    }
  };
}

function mostrarAlerta(msg, tipo = "info") {
  const titulos = { info: "Aviso", success: "Sucesso", error: "Erro", warning: "Atenção" };
  const box = document.getElementById("customAlert");
  if (!box.contains(document.activeElement)) focoAntesAlerta = document.activeElement;
  box.className = "proad-toast" + (tipo === "info" ? "" : " proad-toast--" + tipo);
  document.getElementById("alertTitle").textContent = titulos[tipo] || titulos.info;
  document.getElementById("alertMessage").textContent = msg;
  box.hidden = false;
  document.getElementById("toast-announcement").textContent = `${titulos[tipo] || titulos.info}: ${msg}`;
  clearTimeout(window.timerAlerta);
  if (tipo !== "error") window.timerAlerta = setTimeout(() => {
    if (!box.contains(document.activeElement)) fecharAlerta();
  }, 4500);
}

function fecharAlerta() {
  clearTimeout(window.timerAlerta);
  const box = document.getElementById("customAlert");
  const restaurar = box.contains(document.activeElement);
  box.hidden = true;
  document.getElementById("toast-announcement").textContent = "";
  if (restaurar) {
    const destino = focoDisponivel(focoAntesAlerta) ? focoAntesAlerta : document.getElementById("conteudo-principal");
    destino.focus({ preventScroll: true });
  }
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
  document.getElementById("tema-toggle").textContent =
    document.body.classList.contains("dark-mode")
      ? "Modo claro"
      : "Modo escuro";
}
