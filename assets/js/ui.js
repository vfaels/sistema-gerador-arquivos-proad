// Helpers visuais comuns. Os IDs mantêm o contrato dos quatro geradores.

const CHAVE_TEMA_GLOBAL = "sistema_proad_modo_escuro";
const CHAVES_TEMA_LEGADAS = [
  "sistema_pagamentos_modo_escuro",
  "sistema_fiscalizacao_modo_escuro",
  "sistema_portarias_modo_escuro",
];

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
  const botao = document.getElementById("tema-toggle");
  if (!botao) return;
  botao.textContent =
    document.body.classList.contains("dark-mode")
      ? "Modo claro"
      : "Modo escuro";
}

function lerPreferenciaTema() {
  try {
    const preferenciaGlobal = localStorage.getItem(CHAVE_TEMA_GLOBAL);
    if (preferenciaGlobal !== null) return preferenciaGlobal === "true";

    for (const chave of CHAVES_TEMA_LEGADAS) {
      const preferenciaLegada = localStorage.getItem(chave);
      if (preferenciaLegada !== null) {
        localStorage.setItem(CHAVE_TEMA_GLOBAL, preferenciaLegada);
        return preferenciaLegada === "true";
      }
    }
  } catch (_) {
    // A interface continua utilizável quando o armazenamento está indisponível.
  }
  return false;
}

function aplicarTemaGlobal(modoEscuro) {
  document.body.classList.toggle("dark-mode", modoEscuro);
  atualizarBotaoTema();
}

function carregarTemaGlobal() {
  aplicarTemaGlobal(lerPreferenciaTema());
}

function alternarTemaGlobal() {
  const modoEscuro = !document.body.classList.contains("dark-mode");
  aplicarTemaGlobal(modoEscuro);
  try {
    localStorage.setItem(CHAVE_TEMA_GLOBAL, String(modoEscuro));
  } catch (_) {
    // A alteração visual ainda vale durante a sessão atual.
  }
}

window.addEventListener("storage", (evento) => {
  if (evento.key === CHAVE_TEMA_GLOBAL && evento.newValue !== null) {
    aplicarTemaGlobal(evento.newValue === "true");
  }
});

function configurarNavegacaoEnter(formulario, validarCampo) {
  formulario.addEventListener("keydown", (evento) => {
    const campo = evento.target;
    if (
      evento.key !== "Enter" ||
      evento.defaultPrevented ||
      evento.isComposing ||
      evento.altKey ||
      evento.ctrlKey ||
      evento.metaKey ||
      evento.shiftKey ||
      !(campo instanceof HTMLInputElement) ||
      ["button", "checkbox", "file", "hidden", "radio", "reset", "submit"].includes(campo.type)
    ) return;

    const mensagem = validarCampo(campo);
    if (mensagem) {
      evento.preventDefault();
      if (campo.id && document.getElementById(campo.id + "-erro")) definirErroCampo(campo.id, mensagem);
      campo.focus();
      return;
    }

    if (typeof normalizarCampoEntrada === "function") normalizarCampoEntrada(campo);
    if (campo.id && document.getElementById(campo.id + "-erro")) definirErroCampo(campo.id, "");

    const campos = [...formulario.querySelectorAll("input, select, textarea")]
      .filter((item) => focoDisponivel(item) && item.type !== "hidden");
    const proximo = campos[campos.indexOf(campo) + 1];
    const destino = proximo || formulario.querySelector('[type="submit"]');
    if (destino && focoDisponivel(destino)) {
      evento.preventDefault();
      destino.focus();
    }
  });
}
