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