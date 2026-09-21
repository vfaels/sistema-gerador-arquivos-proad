# Status do roadmap

Este documento representa uma direção geral de UX/UI.

As fases NÃO precisam mais ser executadas sequencialmente.

O projeto já possui parte das melhorias implementadas.

A partir deste ponto, o desenvolvimento deve priorizar:

1. bugs confirmados;
2. funcionalidades ausentes;
3. inconsistências específicas;
4. melhorias pontuais de UX.

Antes de executar qualquer item do roadmap, verificar se ele já foi implementado.

Não repetir trabalho já concluído.

# Roadmap de Modernização UX/UI

## Sistema de Geração de Documentos — PROAD/UFRR

Este documento contém o planejamento de modernização da interface.

O Codex deve utilizar este documento como referência, mas NÃO deve implementar todas as fases simultaneamente.

Sempre consultar também o arquivo `/AGENTS.md`.

---

## Objetivo

Modernizar a interface mantendo:

- geração PDF;
- geração DOCX;
- documentos A4;
- conteúdo institucional;
- regras administrativas;
- funcionamento atual.

---

## Fluxo principal

O usuário deve seguir:

1. Preencher dados.
2. Gerar prévia.
3. Conferir documento.
4. Baixar PDF ou DOCX.

---
# Estratégia de implantação

A modernização é global.

`pagamentos.html` será utilizado somente como ambiente piloto para validar:

- design system;
- formulários;
- validações;
- toolbar;
- preview;
- responsividade;
- mobile;
- acessibilidade.

Depois da validação, o mesmo padrão deve ser aplicado aos demais geradores.

---

# FASE 0 — Auditoria global

Analisar:

- `index.html`;
- `pagamentos.html`;
- `oficios.html`;
- `portarias_fiscalizacao.html`;
- `portarias_planejamento.html`;
- `styles.css`.

Identificar diferenças e funcionalidades específicas de cada tela.

Não editar arquivos nesta fase.

---

# FASE 1 — Design System Global

Criar componentes e estilos que possam ser utilizados por TODOS os geradores.

Trabalhar principalmente em:

`styles.css`

O design system deve ser mobile first.

---

# FASE 2 — Implementação piloto

Aplicar o novo design system em:

`pagamentos.html`

Objetivo:

validar padrões antes de replicá-los.

Não considerar esta fase como modernização completa do sistema.

---

# FASE 3 — Mobile First

Revisar profundamente `pagamentos.html` em:

- 320px;
- 360px;
- 375px;
- 390px;
- 414px;
- 480px;
- 768px;
- 1024px;
- desktop.

Resolver problemas antes de continuar.

---

# FASE 4 — Preview responsivo

Criar comportamento do documento A4 para telas pequenas:

- fit-to-width;
- zoom;
- fullscreen;
- overflow correto.

---

# FASE 5 — Replicação para todos os geradores

Aplicar o padrão validado em:

- `oficios.html`;
- `portarias_fiscalizacao.html`;
- `portarias_planejamento.html`.

Cada arquivo deve manter suas regras próprias.

Não copiar código cegamente.

---

# FASE 6 — Portal principal

Modernizar:

`index.html`

Garantir navegação mobile e desktop.

---

# FASE 7 — Consolidação

Extrair estilos e JavaScript duplicados.

---

# FASE 8 — Acessibilidade

Executar revisão global.

---

# FASE 9 — Teste completo

Testar todos os geradores em:

Mobile
Tablet
Notebook
Desktop

e testar:

- preview;
- PDF;
- DOCX;
- paginação;
- tema;
- zoom;
- validações;
- navegação.

# Roadmap de Implementação

## Objetivo

Modernizar e aprimorar todo o Sistema Gerador de Documentos da PROAD/UFRR,
preservando:

- conteúdo institucional;
- geração de PDF;
- geração de DOCX;
- paginação A4;
- regras específicas de cada documento;
- compatibilidade com desktop e dispositivos móveis.

A modernização se aplica a:

- `index.html`
- `pagamentos.html`
- `oficios.html`
- `portarias_fiscalizacao.html`
- `portarias_planejamento.html`

`pagamentos.html` será utilizado como página piloto apenas para validar
o padrão visual e de responsividade.

---

# Estratégia

O desenvolvimento deve ser incremental.

Cada fase deve:

1. ter escopo limitado;
2. ser testada;
3. gerar um commit próprio;
4. não avançar automaticamente para a próxima fase;
5. atualizar documentação quando necessário.

---

# FASE 0 — Auditoria global

Objetivo:

Entender o estado real do sistema antes de modificar código.

Analisar:

- estrutura dos arquivos;
- dependências;
- JavaScript duplicado;
- CSS duplicado;
- validações;
- preview;
- PDF;
- DOCX;
- paginação;
- tema;
- responsividade;
- problemas registrados no backlog.

Também analisar a implementação atual de Portarias de Fiscalização
e identificar o impacto futuro de múltiplos contratos.

Nesta fase:

- não alterar código funcional;
- atualizar `ARQUITETURA.md`;
- atualizar `TESTES.md`.

---

# FASE 1 — Padronização de validações e formatadores

Objetivo:

Criar/reutilizar regras consistentes para:

- processo eletrônico;
- CNPJ;
- moeda;
- datas locais quando aplicável.

Evitar implementações diferentes para a mesma regra em cada gerador.

---

# FASE 2 — Comportamentos globais

Objetivo:

Padronizar:

- modo claro/escuro;
- persistência do tema;
- navegação com Enter;
- feedbacks globais;
- comportamento consistente entre páginas.

---

# FASE 3 — Design System Global

Objetivo:

Criar a base visual compartilhada do sistema.

Implementar em `styles.css`:

- cores;
- tipografia;
- espaçamentos;
- botões;
- inputs;
- selects;
- checkboxes;
- estados;
- erros;
- toolbar;
- toast;
- dark mode.

Abordagem obrigatória:

MOBILE FIRST.

---

# FASE 4 — Pagamentos como página piloto

Objetivo:

Aplicar o novo padrão visual em `pagamentos.html`.

Corrigir também:

- formatação monetária;
- prévia inicial;
- validações;
- labels;
- CTA;
- feedbacks.

Validar o padrão antes de replicar para os demais geradores.

---

# FASE 5 — Mobile First e Preview Responsivo

Objetivo:

Garantir boa experiência em:

- celular;
- tablet;
- notebook;
- desktop.

Implementar:

- layout mobile first;
- preview adaptável;
- ajustar à largura;
- zoom;
- fullscreen;
- overflow correto.

Importante:

A interface é responsiva.

O documento continua A4.

---

# FASE 6 — Correções da Portaria de Fiscalização

Antes de implementar múltiplos contratos, corrigir o fluxo atual.

Tratar:

- composição da equipe em alteração;
- escolha de funções;
- campo Objeto;
- atualização automática da composição;
- separadores duplicados.

Não implementar múltiplos contratos ainda.

---

# FASE 7 — Múltiplos contratos em Fiscalização

Documento de referência:

`docs/referencias/Portaria_Fiscalizacao_508-2026.pdf`

Objetivo:

Permitir um ou vários contratos na mesma Portaria de Fiscalização.

Cada contrato deve possuir:

- número;
- empresa;
- CNPJ;
- equipe;
- alterações.

Regras:

- Empresa e CNPJ pertencem ao contrato.
- Cada contrato possui equipe independente.
- O mesmo servidor pode exercer funções diferentes em contratos diferentes.
- O Art. 1º deve adaptar singular/plural.
- Todas as relações contrato → empresa → CNPJ devem aparecer.
- Cada contrato deve gerar sua própria tabela.
- Alterações devem apontar para o contrato correto.
- Incisos devem ser gerados automaticamente.

A Portaria 508/2026 deve ser usada como referência estrutural para:

- múltiplos contratos;
- composição independente;
- alterações por contrato;
- múltiplas tabelas;
- paginação longa.

Importante:

A Portaria 508/2026 NÃO contém empresa/CNPJ no Art. 1º.

A inclusão de empresa/CNPJ é uma nova regra funcional deste projeto.

---

# FASE 8 — Portaria de Planejamento

Objetivo:

Implementar e corrigir:

- alteração de portaria;
- número obrigatório;
- composição automática;
- integração com o padrão visual global.

Não assumir que Planejamento utiliza exatamente as mesmas regras
de Fiscalização.

---

# FASE 9 — Ofícios, SICAF e Conta Vinculada

Objetivo:

Padronizar:

- número obrigatório;
- processo eletrônico;
- CNPJ;
- moeda;
- tema;
- validações.

Executar preferencialmente em tarefas separadas.

---

# FASE 10 — Aplicar padrão visual aos demais geradores

Depois que o padrão estiver validado:

- aplicar em Ofícios;
- aplicar em Fiscalização;
- aplicar em Planejamento.

Manter particularidades funcionais de cada módulo.

---

# FASE 11 — Portal principal

Modernizar `index.html`.

Objetivo:

- navegação clara;
- mobile first;
- identidade visual consistente;
- dark mode;
- acesso rápido aos geradores.

Não transformar em dashboard.

---

# FASE 12 — Refatoração compartilhada

Somente depois da estabilidade funcional.

Extrair código realmente compartilhado.

Possíveis categorias:

- tema;
- validações;
- formatadores;
- toast;
- preview;
- helpers de interface.

Não generalizar regras específicas de documentos.

---

# FASE 13 — Acessibilidade

Revisar todo o sistema:

- labels;
- teclado;
- foco;
- contraste;
- aria;
- mensagens;
- áreas de toque;
- toolbar;
- formulários.

---

# FASE 14 — Regressão final

Não adicionar novas funcionalidades.

Executar todo o `TESTES.md`.

Verificar:

- conteúdos oficiais;
- preview;
- PDF;
- DOCX;
- múltiplos contratos;
- empresa/CNPJ;
- equipes;
- paginação;
- tema;
- mobile;
- acessibilidade.

Corrigir somente regressões confirmadas.