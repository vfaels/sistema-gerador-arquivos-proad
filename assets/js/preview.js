// Visualização apenas: não altera templates, medidas A4 ou paginação.
// Contratos: preview-content, preview-zoom-wrapper, preview-viewport,
// zoom-indicador, zoom-ajustar, visualizador, preview-fullscreen e .pdf-export.

let zoomPreview = 1;
let ajustarPreview = true;
let framePreview;

function atualizarZoom() {
  const preview = document.getElementById("preview-content");
  const wrapper = document.getElementById("preview-zoom-wrapper");
  // Nunca reaplicar a transformação enquanto o conversor captura o A4.
  if (wrapper.hidden || preview.classList.contains("pdf-export")) return;
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
}

function alterarZoom(v) {
  ajustarPreview = false;
  zoomPreview = Math.min(
    2,
    Math.max(Math.min(0.25, escalaDisponivel()), Number((zoomPreview + v).toFixed(2))),
  );
  atualizarZoom();
}

function resetarZoom() {
  ajustarPreview = false;
  zoomPreview = 1;
  atualizarZoom();
}

function sincronizarTelaCheia() {
  const painel = document.getElementById("visualizador");
  const ativo = document.fullscreenElement === painel || painel.classList.contains("proad-preview-expanded");
  const botao = document.getElementById("preview-fullscreen");
  botao.textContent = ativo ? "Sair da tela cheia" : "Tela cheia";
  botao.setAttribute("aria-pressed", String(ativo));
  document.body.classList.toggle("proad-preview-open", ativo);
  agendarZoom();
  if (!ativo) botao.focus({ preventScroll: true });
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
