// Visualização apenas: não altera templates, medidas A4 ou paginação.
// Contratos: preview-content, preview-zoom-wrapper, preview-viewport,
// zoom-indicador, zoom-ajustar, visualizador, preview-fullscreen e .pdf-export.

let zoomPreview = 1;
let ajustarPreview = true;
let framePreview;
let telaCheiaAtiva = false;
let estadosForaTelaCheia = [];

function anunciarEscala() {
  document.getElementById("preview-status").textContent = `Zoom ${Math.round(zoomPreview * 100)}%.`;
}

function limparMarcacaoPreview(clone) {
  clone.querySelectorAll("[data-proad-keyboard-link]").forEach(link => {
    const editavelOriginal = JSON.parse(link.getAttribute("data-proad-keyboard-link"));
    if (editavelOriginal === null) link.removeAttribute("contenteditable");
    else link.setAttribute("contenteditable", editavelOriginal);
    link.removeAttribute("tabindex");
    link.removeAttribute("data-proad-keyboard-link");
  });
}

function atualizarZoom() {
  const preview = document.getElementById("preview-content");
  const wrapper = document.getElementById("preview-zoom-wrapper");
  // Nunca reaplicar a transformação enquanto o conversor captura o A4.
  if (wrapper.hidden || preview.classList.contains("pdf-export")) return;
  // Links dentro de contenteditable precisam de tabindex explícito no preview.
  preview.querySelectorAll('a[href]:not([tabindex])').forEach(link => {
    link.setAttribute("data-proad-keyboard-link", JSON.stringify(link.getAttribute("contenteditable")));
    link.setAttribute("tabindex", "0");
    link.setAttribute("contenteditable", "false");
  });
  if (ajustarPreview) zoomPreview = escalaDisponivel();
  preview.style.transform = `scale(${zoomPreview})`;
  preview.style.transformOrigin = "top left";
  wrapper.style.width = `${preview.offsetWidth * zoomPreview}px`;
  wrapper.style.height = `${preview.offsetHeight * zoomPreview}px`;
  document.getElementById("zoom-indicador").textContent =
    `${Math.round(zoomPreview * 100)}%`;
  document.getElementById("zoom-indicador").setAttribute("aria-label",
    `Zoom atual ${Math.round(zoomPreview * 100)}%. Restaurar zoom para 100%`);
  document.getElementById("zoom-ajustar").setAttribute("aria-pressed", String(ajustarPreview));
}

function escalaDisponivel() {
  const viewport = document.getElementById("preview-viewport");
  const estilo = getComputedStyle(viewport);
  const largura = viewport.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight);
  return Math.min(1, Math.max(1, largura - 1) / document.getElementById("preview-content").offsetWidth);
}

function agendarZoom() {
  cancelAnimationFrame(framePreview);
  framePreview = requestAnimationFrame(atualizarZoom);
}

function ajustarLargura() {
  ajustarPreview = true;
  atualizarZoom();
  document.getElementById("preview-viewport").scrollLeft = 0;
  anunciarEscala();
}

function alterarZoom(v) {
  ajustarPreview = false;
  zoomPreview = Math.min(
    2,
    Math.max(Math.min(0.25, escalaDisponivel()), Number((zoomPreview + v).toFixed(2))),
  );
  atualizarZoom();
  anunciarEscala();
}

function resetarZoom() {
  ajustarPreview = false;
  zoomPreview = 1;
  atualizarZoom();
  anunciarEscala();
}

function sincronizarTelaCheia() {
  const painel = document.getElementById("visualizador");
  const ativo = document.fullscreenElement === painel || painel.classList.contains("proad-preview-expanded");
  const botao = document.getElementById("preview-fullscreen");
  botao.textContent = ativo ? "Sair da tela cheia" : "Tela cheia";
  document.body.classList.toggle("proad-preview-open", ativo);
  if (ativo && !telaCheiaAtiva) {
    // Desativar apenas irmãos fora do painel; preservar os estados anteriores.
    for (let ramo = painel; ramo !== document.body; ramo = ramo.parentElement) {
      for (const irmao of ramo.parentElement.children) {
        if (irmao !== ramo) {
          estadosForaTelaCheia.push([irmao, irmao.inert]);
          irmao.inert = true;
        }
      }
    }
    botao.focus({ preventScroll: true });
  } else if (!ativo && telaCheiaAtiva) {
    estadosForaTelaCheia.forEach(([elemento, inerte]) => { elemento.inert = inerte; });
    estadosForaTelaCheia = [];
    botao.focus({ preventScroll: true });
  }
  telaCheiaAtiva = ativo;
  agendarZoom();
}

async function alternarTelaCheia() {
  const painel = document.getElementById("visualizador");
  if (document.fullscreenElement === painel) {
    await document.exitFullscreen();
  } else if (painel.classList.contains("proad-preview-expanded")) {
    painel.classList.remove("proad-preview-expanded");
    sincronizarTelaCheia();
  } else {
    try {
      if (!document.fullscreenEnabled || !painel.requestFullscreen) throw new Error("Fullscreen indisponível");
      await painel.requestFullscreen();
    } catch (erro) {
      // Alternativa dentro da aba para navegadores sem Fullscreen API.
      painel.classList.add("proad-preview-expanded");
    }
    sincronizarTelaCheia();
  }
}

document.addEventListener("keydown", evento => {
  if (!telaCheiaAtiva || evento.key !== "Tab") return;
  const painel = document.getElementById("visualizador");
  const controles = [...painel.querySelectorAll('button, a[href], [tabindex], [contenteditable="true"]')]
    .filter(elemento => !elemento.disabled && !elemento.closest('[inert]') &&
      (elemento.tabIndex >= 0 || elemento.getAttribute("contenteditable") === "true") && elemento.getClientRects().length);
  const primeiro = controles[0], ultimo = controles[controles.length - 1];
  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault(); ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault(); primeiro.focus();
  }
});
