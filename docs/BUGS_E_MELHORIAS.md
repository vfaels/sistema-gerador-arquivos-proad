# Backlog — Bugs e Melhorias

## Sistema Gerador de Documentos — PROAD/UFRR

Este documento registra bugs, inconsistências e funcionalidades
a implementar.

Não implementar todos os itens simultaneamente.

Cada item deve passar por:

1. investigação;
2. implementação isolada;
3. teste;
4. validação;
5. commit específico.

---

# GLOBAL

## BUG-G01 — Persistência global do tema

Corrigir o modo escuro para utilizar uma preferência compartilhada entre:

- index;
- pagamentos;
- ofícios;
- fiscalização;
- planejamento.

Critérios:

- preferência permanece após reload;
- preferência permanece após trocar de página;
- documento A4 continua branco.

---

## UX-G02 — Diferenciar Tema de Portal

O botão de modo escuro não deve possuir o mesmo peso visual de
"Portal inicial".

Objetivo:

reduzir risco de clique acidental no Portal.

---

## FEAT-G03 — Navegação com Enter

Ao pressionar Enter em um input:

1. validar o campo atual;
2. se válido, focar próximo campo;
3. se inválido, permanecer no campo;
4. não gerar documento enquanto existirem obrigatórios incompletos;
5. no último campo válido, permitir avançar para geração.

Não interceptar Enter em textarea quando a quebra de linha for necessária.

---

## VAL-G04 — Processo eletrônico padronizado

Formato:

23129.123456/2025-01

Situação inicialmente identificada:

- Pagamentos: funcionando;
- Fiscalização: funcionando;
- Ofícios: revisar/corrigir;
- Planejamento: revisar/corrigir.

Criar regra compartilhada quando possível.

---

## VAL-G05 — CNPJ compartilhado

Criar:

- máscara;
- normalização;
- validação;
- mensagem de erro.

Formato:

00.000.000/0000-00

Antes de implementar validação matemática dos dígitos verificadores,
confirmar se a regra desejada é:

A) apenas formato;

ou

B) formato + dígitos verificadores.

---

## VAL-G06 — Moeda brasileira

Criar uma função compartilhável de formatação monetária.

Exemplos:

2000
→ R$ 2.000,00

2000,5
→ R$ 2.000,50

15000.5
→ R$ 15.000,50

Internamente evitar realizar cálculos utilizando strings formatadas.

---

# PAGAMENTOS

## VAL-PAG-01 — Valor

Aplicar a formatação monetária global.

---

## BUG-PAG-02 — Prévia inicial

Investigar por que a primeira abertura não apresenta a prévia.

Se existirem dados iniciais suficientes para gerar o documento,
a prévia deve ser inicializada automaticamente.

---

# OFÍCIOS

## BUG-OFI-01 — Tema

Aplicar a persistência global do tema.

---

## VAL-OFI-02 — Número do ofício

O número do ofício é obrigatório.

Bloquear geração quando estiver ausente.

---

## VAL-OFI-03 — Processo eletrônico

Aplicar máscara e validação global.

---

# CONTA VINCULADA

## VAL-CV-01 — CNPJ

Aplicar máscara/validação compartilhada.

---

## VAL-CV-02 — Valor

Aplicar formatação monetária compartilhada.

---

# SICAF

## VAL-SIC-01 — CNPJ

Aplicar máscara/validação compartilhada.

---

## VAL-SIC-02 — Processo eletrônico

Aplicar máscara/validação compartilhada.

---

# PORTARIA DE PLANEJAMENTO

## FEAT-PLA-01 — Alteração de Portaria

Implementar geração de alteração de Portaria de Planejamento.

Antes de implementar:

- analisar o modelo atual;
- analisar campos realmente utilizados;
- não assumir que Fiscalização e Planejamento possuem regras idênticas.

---

## VAL-PLA-02 — Número da Portaria

Número da Portaria é obrigatório quando aplicável.

---

## FEAT-PLA-03 — Composição automática

Ao preencher presidente/membro e função,
refletir automaticamente a informação na composição da equipe
quando apropriado.

Evitar preenchimento duplicado.

---

# PORTARIA DE FISCALIZAÇÃO

## BUG-FIS-01 — Composição na alteração

A opção de composição da equipe desapareceu no fluxo de alteração.

Restaurar ou reimplementar após analisar a lógica existente.

---

## FEAT-FIS-02 — Funções

Permitir seleção explícita das funções.

Não inventar funções.

Utilizar somente funções previstas nos modelos/documentos oficiais.

---

## BUG-FIS-03 — Campo Objeto

No fluxo de alteração, o campo Objeto está marcado como obrigatório,
mas aparentemente não aparece no documento gerado.

Investigar:

- se deve existir;
- se deve aparecer no documento;
- se deve deixar de ser obrigatório.

Não decidir apenas com base no formulário.

---

## FEAT-FIS-04 — Atualização automática da equipe

Ao informar servidor + função numa alteração,
atualizar a composição correspondente quando possível.

Evitar digitação duplicada.

---

## BUG-FIS-05 — Linha horizontal duplicada

Remover a segunda linha separadora antes de "Gerar prévia".

---

# FEAT-FIS-06 — Múltiplos contratos

## Referência

Portaria Fiscalização nº 508/2026 - PROAD.

## Objetivo

Permitir Portarias de Fiscalização contendo:

- um contrato;
- dois contratos;
- vários contratos.

Não estabelecer limite fixo desnecessário.

---

## Estrutura

Cada contrato deve possuir:

- número do contrato;
- empresa contratada;
- CNPJ;
- equipe;
- alterações relacionadas.

Estrutura conceitual:

contratos = [
  {
    id,
    numero,
    empresa,
    cnpj,
    equipe: [],
    alteracoes: []
  }
]

---

## Interface

Cada contrato deve ser representado por um grupo repetível.

Exemplo:

CONTRATO 1

Número *
Empresa *
CNPJ *

Equipe
[...]

[ Remover contrato ]

[ + Adicionar contrato ]

---

## Empresa e CNPJ

Empresa e CNPJ pertencem ao CONTRATO.

Não armazenar uma única empresa globalmente quando houver vários
contratos.

Exemplo:

Contrato 29/2025
Empresa A
CNPJ A

Contrato 30/2025
Empresa B
CNPJ B

Contrato 31/2025
Empresa C
CNPJ C

---

## Art. 1º

O Art. 1º deve adaptar-se automaticamente.

### Um contrato

Usar construção no singular:

Contrato nº ...

empresa ...

CNPJ ...

### Vários contratos

Usar construção no plural:

Contratos ...

e incluir cada relação:

Contrato → Empresa → CNPJ.

Não perder nenhuma empresa/CNPJ informado.

Não associar empresa ao contrato errado.

---

## Redação

Separar lógica de dados de lógica textual.

Criar funções responsáveis por:

- formar lista de contratos;
- escolher singular/plural;
- gerar relação empresa/CNPJ;
- gerar texto final.

Evitar construir toda a frase diretamente dentro de
`innerHTML` com várias condicionais.

---

## Equipes

Cada contrato possui equipe independente.

Um servidor pode ter:

Contrato A → Gestor

Contrato B → Fiscal Administrativo

Contrato C → Gestor Substituto

Isso deve ser permitido.

---

## Alterações

Cada alteração deve selecionar o contrato afetado.

Campos:

- contrato;
- servidor novo;
- SIAPE;
- função;
- servidor substituído;
- tipo.

Gerar:

I
II
III
IV
...

automaticamente.

---

## Tabelas

Gerar uma tabela por contrato.

Formato:

Contrato nº XX/AAAA

SERVIDOR | SIAPE | FUNÇÃO

A paginação deve suportar várias tabelas em várias páginas.

---

## Critérios de aceite

- [ ] Um contrato funciona.
- [ ] Dois contratos funcionam.
- [ ] Três contratos funcionam.
- [ ] Seis contratos funcionam.
- [ ] Empresa independente por contrato.
- [ ] CNPJ independente por contrato.
- [ ] Equipe independente por contrato.
- [ ] Mesmo servidor pode ter funções diferentes.
- [ ] Art. 1º singular funciona.
- [ ] Art. 1º plural funciona.
- [ ] Todas as empresas aparecem.
- [ ] Todos os CNPJs aparecem.
- [ ] Associação empresa/contrato permanece correta.
- [ ] Alterações pertencem ao contrato correto.
- [ ] Incisos são gerados automaticamente.
- [ ] Tabelas são geradas por contrato.
- [ ] Paginação funciona.
- [ ] PDF funciona.
- [ ] DOCX funciona.