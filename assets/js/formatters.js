// Máscara compartilhada somente por Pagamentos e Fiscalização.
// Ofícios e Planejamento mantêm seus campos de processo livres.

function formatarProcesso(valor) {
  const n = String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 17);
  if (!n) return "";
  let r = n.slice(0, 5);
  if (n.length > 5) r += `.${n.slice(5, 11)}`;
  if (n.length > 11) r += `/${n.slice(11, 15)}`;
  if (n.length > 15) r += `-${n.slice(15, 17)}`;
  return r;
}

function formatarProcessoCampo(campo) {
  campo.value = formatarProcesso(campo.value);
}
