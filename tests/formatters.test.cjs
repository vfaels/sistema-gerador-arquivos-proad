// Sem dependências: node --test tests/formatters.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/formatters.js'), 'utf8'), contexto);

test('processo: máscara progressiva, completude e entrada sem pontuação', () => {
  for (const valor of ['23129123456202501', '23129.123456/2025-01']) {
    assert.equal(contexto.formatarProcesso(valor), '23129.123456/2025-01');
    assert.equal(contexto.processoValido(valor), true);
  }
  for (const valor of ['', '123', '23129.123456/2025-0', '231291234562025011', 'abc23129123456202501']) {
    assert.equal(contexto.processoValido(valor), false, valor);
  }
  assert.equal(contexto.formatarProcesso('231291'), '23129.1');
});

test('CNPJ: máscara e formato completo, sem validação matemática', () => {
  for (const valor of ['12345678000190', '12.345.678/0001-90', '00000000000000']) {
    assert.equal(contexto.cnpjValido(valor), true, valor);
  }
  for (const valor of ['', '123', '1234567800019', '123456780001900', 'ab.345.678/0001-90']) {
    assert.equal(contexto.cnpjValido(valor), false, valor);
  }
  assert.equal(contexto.formatarCnpj('123'), '12.3');
  assert.equal(contexto.formatarCnpj('12345678000190'), '12.345.678/0001-90');
});

test('moeda: valores inteiros, decimais e agrupamento brasileiro sem perda de centavos', () => {
  const casos = [
    ['2000', 200000, '2.000,00'], ['2000,5', 200050, '2.000,50'],
    ['15000.5', 1500050, '15.000,50'], ['1.500,00', 150000, '1.500,00'],
    ['R$ 2.000,50', 200050, '2.000,50'], ['0', 0, '0,00'],
    ['0,01', 1, '0,01'], ['0002,50', 250, '2,50'],
    ['1.234', 123400, '1.234,00'], ['1.234.567,89', 123456789, '1.234.567,89'],
    [' 15.50 ', 1550, '15,50'], ['90071992547409,91', Number.MAX_SAFE_INTEGER, '90.071.992.547.409,91'],
  ];
  for (const [entrada, centavos, saida] of casos) {
    assert.equal(contexto.moedaEmCentavos(entrada), centavos, entrada);
    assert.equal(contexto.formatarMoeda(entrada), saida, entrada);
    assert.equal(contexto.formatarMoeda(saida), saida, 'idempotência ' + entrada);
  }
});

test('moeda: não transformar entrada inválida em zero ou arredondar silenciosamente', () => {
  for (const valor of ['', ' ', 'R$', 'abc', '-1', '1,234', '1.2345', '1,', '1.',
    '1,500.00', '1e3', 'Infinity', 'NaN', '12.34,56', '90071992547409,92']) {
    assert.equal(contexto.moedaEmCentavos(valor), null, valor);
    const campo = { value: valor };
    contexto.formatarMoedaCampo(campo);
    assert.equal(campo.value, valor, 'preserva entrada para correção: ' + valor);
  }
});

test('integração por data-formato: erro específico, normalização e dispensa de disabled/vazio', () => {
  const campo = (formato, value) => ({ dataset: { formato }, value, disabled: false });
  for (const formato of ['cnpj', 'processo', 'moeda']) {
    assert.equal(contexto.erroFormatoCampo(campo(formato, '')), '');
    const desabilitado = { ...campo(formato, 'abc'), disabled: true };
    assert.equal(contexto.erroFormatoCampo(desabilitado), '');
    contexto.normalizarCampoEntrada(desabilitado);
    assert.equal(desabilitado.value, 'abc');
    assert.notEqual(contexto.erroFormatoCampo(campo(formato, 'abc')), '');
  }
  for (const [formato, entrada, saida] of [
    ['processo', '23129123456202501', '23129.123456/2025-01'],
    ['cnpj', '12345678000190', '12.345.678/0001-90'],
    ['moeda', '2000,5', '2.000,50'],
  ]) {
    const c = campo(formato, entrada);
    contexto.normalizarCampoEntrada(c);
    assert.equal(c.value, saida);
  }
});

test('data local usa componentes locais, inclusive quando a data UTC já mudou', () => {
  const data = {
    getFullYear: () => 2026, getMonth: () => 8, getDate: () => 18,
    toISOString: () => { throw new Error('Não usar UTC'); },
  };
  assert.equal(contexto.dataLocalISO(data), '2026-09-18');
  assert.equal(contexto.dataLocalISO({ ...data, getMonth: () => 0, getDate: () => 2 }), '2026-01-02');
});
