// Regras de entrada compartilhadas. Obrigatoriedade e participação no documento
// continuam nos geradores; formatadores não modificam templates ou paginação.

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

function processoValido(valor) {
  return /^(?:\d{17}|\d{5}\.\d{6}\/\d{4}-\d{2})$/.test(String(valor ?? "").trim());
}

// Máscara progressiva originalmente usada em Fiscalização.
function formatarCnpj(valor) {
  const numeros = String(valor ?? "").replace(/\D/g, "").slice(0, 14);
  if (!numeros) return "";
  let resultado = numeros;
  if (numeros.length > 2) resultado = `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
  if (numeros.length > 5) resultado = `${resultado.slice(0, 6)}.${numeros.slice(5)}`;
  if (numeros.length > 8) resultado = `${resultado.slice(0, 10)}/${numeros.slice(8)}`;
  if (numeros.length > 12) resultado = `${resultado.slice(0, 15)}-${numeros.slice(12)}`;
  return resultado;
}

function formatarCnpjCampo(campo) {
  campo.value = formatarCnpj(campo.value);
}

// Valida somente formato completo, conforme decisão da FASE 1; não verifica DV.
function cnpjValido(valor) {
  return /^(?:\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/.test(String(valor ?? "").trim());
}

// Retorna centavos inteiros seguros ou null. Não arredonda entradas inválidas.
// Ponto com três dígitos é agrupamento brasileiro; com um/dois, decimal.
function moedaEmCentavos(valor) {
  const texto = String(valor ?? "").trim().replace(/^R\$\s*/, "");
  let partes = texto.match(/^(\d+|\d{1,3}(?:\.\d{3})+)(?:,(\d{1,2}))?$/);
  if (!partes) partes = texto.match(/^(\d+)\.(\d{1,2})$/);
  if (!partes) return null;
  const centavos = Number(partes[1].replace(/\./g, "") + (partes[2] || "").padEnd(2, "0"));
  return Number.isSafeInteger(centavos) ? centavos : null;
}

function formatarMoeda(valor) {
  const centavos = moedaEmCentavos(valor);
  if (centavos === null) return "";
  const digitos = String(centavos).padStart(3, "0");
  // Sem prefixo: os templates oficiais já acrescentam R$.
  return digitos.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + digitos.slice(-2);
}

function formatarMoedaCampo(campo) {
  const formatado = formatarMoeda(campo.value);
  if (formatado) campo.value = formatado;
}

function dataLocalISO(data = new Date()) {
  return [data.getFullYear(), String(data.getMonth() + 1).padStart(2, "0"),
    String(data.getDate()).padStart(2, "0")].join("-");
}

function erroFormatoCampo(campo) {
  if (campo.disabled || !campo.value.trim()) return "";
  switch (campo.dataset.formato) {
    case "processo": return processoValido(campo.value) ? "" : "Informe o processo completo no formato 23129.123456/2025-01.";
    case "cnpj": return cnpjValido(campo.value) ? "" : "Informe o CNPJ completo no formato 00.000.000/0000-00.";
    case "moeda": return moedaEmCentavos(campo.value) !== null ? "" : "Informe um valor como 2.000,50, com no máximo duas casas decimais.";
    default: return "";
  }
}

function normalizarCampoEntrada(campo) {
  if (campo.disabled || !campo.value.trim() || erroFormatoCampo(campo)) return;
  switch (campo.dataset.formato) {
    case "processo": formatarProcessoCampo(campo); break;
    case "cnpj": formatarCnpjCampo(campo); break;
    case "moeda": formatarMoedaCampo(campo); break;
  }
}
