# Arquitetura do Sistema Gerador PROAD

## FASE 1 — Entradas compartilhadas (18/09/2026)

Esta seção atualiza o estado descrito na reauditoria abaixo, que permanece como baseline anterior à implementação. Escopo: formatadores/validação de entrada, sem mudanças de templates, conteúdo institucional, paginação, exportadores, tema ou múltiplos contratos.

`assets/js/formatters.js` agora é carregado pelos quatro geradores antes dos scripts inline. Reutiliza a máscara de processo de Pagamentos/Fiscalização e a máscara progressiva de CNPJ de Fiscalização; as duas implementações locais de CNPJ foram removidas. Não há biblioteca nova.

- `processoValido`: aceita 17 dígitos ou o formato completo `23129.123456/2025-01`; `formatarProcesso`/`formatarProcessoCampo` conservam máscara progressiva e limite anteriores. Não fixa o prefixo 23129 nem verifica validade administrativa.
- `cnpjValido`: aceita 14 dígitos ou `00.000.000/0000-00`. **Somente formato, sem dígitos verificadores**, conforme escolha explícita do usuário nesta fase. `formatarCnpj`/`formatarCnpjCampo` normalizam a pontuação; completude é validada separadamente.
- `moedaEmCentavos`: retorna centavos como inteiro seguro ou null, sem cálculos sobre texto formatado. Aceita inteiro, decimal com vírgula ou ponto (uma/duas casas), agrupamento brasileiro e prefixo opcional `R$`. Ponto seguido de três dígitos é agrupamento (`1.234` → `1.234,00`); entradas negativas, agrupamento inválido, frações com mais de duas casas ou fora da precisão inteira segura são rejeitadas, sem arredondamento silencioso.
- `formatarMoeda`/`formatarMoedaCampo`: saída com duas casas e separadores brasileiros, **sem prefixo**, pois os templates já acrescentam `R$`. Campos de Pagamentos/Conta normalizam em change e também na validação antes da montagem, cobrindo submissão por Enter. Entrada inválida permanece disponível para correção, sem virar zero.
- `dataLocalISO`: concentra a montagem de YYYY-MM-DD pelos componentes locais, já usada nos quatro onload. Datas por extenso/curtas dos documentos continuam específicas, sem alteração de sua redação.

`data-formato="processo|cnpj|moeda"` identifica os campos existentes para `erroFormatoCampo` e `normalizarCampoEntrada`. Validação/normalização não consultam IDs de modelos: os geradores decidem required, disabled e participação no documento, exibem a mensagem compartilhada pelos mecanismos atuais de aria-invalid/erro/foco e normalizam campos válidos antes de montar.

Integrações: processo principal em Pagamentos e Fiscalização, referência em Fiscalização/Planejamento, processo SICAF; CNPJ de Fiscalização/SICAF/Conta; moeda de Pagamentos/Conta. S/N continua dispensando e limpando o campo. Referências não selecionadas não validam; selecionadas vazias continuam opcionais, mas preenchimento parcial é rejeitado. Na alteração de Fiscalização, processo principal não usado e CNPJ não usado em Empenho permanecem dispensados. Obrigatoriedade de números, fluxo inicial de prévia e composição de equipes não mudaram.

Nova verificação local sem dependências: `node --test tests/formatters.test.cjs`. Integração, comparação documental e limitações estão na seção FASE 1 de mesma data em TESTES.md. A FASE 2 não foi iniciada.

## FASE 0 — Reauditoria do backlog e múltiplos contratos (18/09/2026)

**Estado atual confirmado no código.** Esta seção prevalece sobre descrições históricas abaixo. Os registros de 16–17/09 documentam versões intermediárias; suas afirmações sobre ausência de validação, zoom, módulos compartilhados ou acessibilidade não descrevem mais o sistema atual. Nenhuma funcionalidade foi implementada nesta auditoria.

Foram lidos os cinco HTMLs, `styles.css`, todos os JS/CSS de `assets/`, as cinco instruções/documentações solicitadas e o PDF de referência; as três imagens locais e as quatro páginas do PDF foram visualizadas. A análise de código foi complementada por execução isolada de funções no Node, não por nova regressão em navegador/Word. Resultados e roteiros estão na seção de mesma data em [TESTES.md](TESTES.md).

O roadmap contém duas sequências de fases. Para o mapa de impactos abaixo, considera-se sua seção final **“Roadmap de Implementação” (0–14)**, que inclui backlog e múltiplos contratos. As fases antigas e a enumeração resumida de AGENTS.md são registros distintos. A autorização desta tarefa limita-se à FASE 0 e à edição destes dois documentos.

### Arquitetura em operação

Aplicação estática, sem backend, framework SPA, build, manifesto de dependências ou suíte versionada de testes. Cada gerador contém formulário, regras administrativas, templates, paginação/exportadores e controlador de operações em JavaScript inline. Scripts clássicos compartilhados carregam antes do script local; não existe `app.js` ou `export.js`.

| Arquivo | Responsabilidade e estado atual |
| --- | --- |
| `index.html` | Portal com quatro links reais, ícones SVG inline e link de pular navegação; somente `styles.css` e favicon. Não tem JavaScript, controle de tema ou restauração de preferência. |
| `pagamentos.html` | Bolsa/Nota Fiscal; processo/S/N, data, descrição ou empresa, mês apenas para Bolsa e valor. Valida processo completo e sintaxe monetária; não normaliza moeda. Inicializa data local, mas deixa preview vazio e downloads bloqueados até geração válida. Não restaura os campos do pagamento. |
| `oficios.html` | SICAF: empresa/CNPJ/e-mail/processo/S/N. Conta Vinculada: empresa/CNPJ/valor/evento/contrato/banco/agência/conta/data do e-mail/descrição. Número opcional e data comuns. Monta prévia com marcadores ao abrir/trocar modelo; apenas geração validada habilita downloads. Conta Vinculada não possui campo de processo. |
| `portarias_fiscalizacao.html` | Nova/alteração de um Contrato ou Empenho, empresa/CNPJ globais, processo/S/N/objeto, referências selecionáveis, equipe única e substituições separadas. Detalhamento abaixo. |
| `portarias_planejamento.html` | Somente nomeação de equipe: número opcional, data, descrição, centro de custo, prazo, referências e membros com nome/função/SIAPE/setor. Não há fluxo de alteração. Array inicia com Presidente + três Membros; todos podem trocar função. Primeiro índice não pode ser removido. |
| `styles.css` | Design System `proad-*`/`--proad-*`, layout externo, portal, estados, foco, toast e tema; mantém também regras legadas `app-page`/`--app-*`. Os cinco HTMLs não usam `app-page`, mas seletores legados `body.dark-mode` ainda podem atuar. |
| `assets/js/ui.js` | Toast, status, erro por campo, rótulo de tema e preservação de foco. Não persiste tema nem decide regras de validação. |
| `assets/js/preview.js` | Escala, ajuste à largura, reset, fullscreen nativo/alternativo, foco/inert e limpeza da marcação auxiliar de links no clone Word. |
| `assets/js/formatters.js` | Somente máscara progressiva de processo, até 17 dígitos, usada em Pagamentos/Fiscalização. Não valida formato nem dígitos verificadores. |
| `assets/css/generators.css` | Scrollbar WebKit compartilhada somente pelos quatro geradores. |
| `assets/logo_proad.png` | Favicon das cinco páginas, 640 × 640; tipo declarado `image/x-icon`, embora seja PNG. |
| `img/logo_br.png`, `img/logo_ufrr.png` | Imagens institucionais, 132 × 136 e 136 × 148, usadas nos documentos e buscadas para incorporar ao DOCX. |

Dependências externas dos quatro geradores: Tailwind via `cdn.tailwindcss.com`, html2pdf 0.10.1 via cdnjs e html-docx-js via unpkg. Tailwind/html-docx não têm versão fixada na URL; não há cópia local ou integridade SRI. O link do memorando em Fiscalização é navegação externa, não biblioteca. Não foi verificada disponibilidade remota nesta etapa. `fetch` das imagens para Word requer atenção em `file://` e não testa `response.ok`.

### Interface, estado e contratos DOM

- Formulários `pagamento-form`, `oficio-form`, `fiscalizacao-form`, `planejamento-form` usam `novalidate` e handlers `submit` que chamam validação local. Enter mantém submissão nativa, não implementa avanço campo a campo. `operacaoEmCurso`/`previaAtualizada`, `data-document-action` e `data-preview-control` controlam bloqueios, carregamento e downloads. Alterar formulário invalida a prévia para download; edição direta da folha continua exportável, não sincroniza dados nem repagina e é perdida ao regenerar.
- Erros dependem de `id` + `id-erro`, `aria-describedby`, `aria-invalid` e `form-feedback`. UI compartilhada exige `customAlert`, `alertTitle`, `alertMessage`, `toast-announcement`, `document-status`, `tema-toggle`, `conteudo-principal`. Referências de funções/handlers e IDs precisam permanecer coerentes ao criar grupos dinâmicos.
- Visualizador depende de `visualizador`, `preview-content`, `preview-zoom-wrapper`, `preview-viewport`, `zoom-indicador`, `zoom-ajustar`, `preview-fullscreen`, `preview-status`, `.a4-page` e `.pdf-export`. Ajuste calcula largura útil menos padding/1 px de tolerância, limitado a 100%; zoom manual até 200%, mínimo 25% ou menor quando a largura exige. ResizeObserver recalcula modo automático. Fullscreen preserva/restaura inert e foco.
- Mobile: formulário antes do preview, campos em coluna, inputs de 1 rem e controles/labels de checkbox com mínimo 44 px. Em 640 px expandem ações/espaçamento; portal usa duas colunas em 768 px; geradores em 1024 px usam formulário de 320–420 px e preview restante, com rolagem interna. A4 tem largura fixa apenas dentro do viewport escalado. Não há nova medição de overflow/touch nesta auditoria; alturas baixas, teclado virtual e tabelas longas permanecem cenários necessários.
- Tema usa `body.dark-mode`; A4 permanece branco. Chaves separadas: `sistema_pagamentos_modo_escuro`, `sistema_fiscalizacao_modo_escuro`, `sistema_portarias_modo_escuro`. Ofícios alterna sem persistir; portal não aplica tema. Número de Ofícios usa `sistema_oficios_ultimo_numero` a cada input/montagem, removendo chave quando vazio. Portarias usam `sistema_fiscalizacao_ultimo_numero`/`sistema_portarias_ultimo_numero`, gravando só número não vazio na montagem. Equipes não persistem; acesso ao localStorage não possui proteção contra exceções.

### Conferência integral do backlog

Os 24 identificadores abaixo foram confrontados com os fontes. “Pendente” descreve diferença entre implementação e pedido, não autorização para executar. Máscara, validação de formato e validação matemática são capacidades diferentes.

| Item | Constatação atual e evidência no código |
| --- | --- |
| BUG-G01 | Confirmado: persistência separada nos três geradores e ausente em Ofícios/portal; `carregarTema`, `carregarModoEscuro`, `alternarModoEscuro` e chaves acima. |
| UX-G02 | Confirmado o mesmo tratamento visual: Portal inicial e tema usam `proad-button` sem variante nos quatro headers. Risco de clique acidental é hipótese de usabilidade, não ocorrência medida. |
| FEAT-G03 | Pendente: listeners de teclado locais tratam Escape e compartilhado trata Tab em fullscreen; submit valida todo formulário. Não há navegação sequencial com Enter. Textarea mantém quebra nativa. |
| VAL-G04 | Parcial: máscara compartilhada em Pagamentos/Fiscalização; somente `erroDoCampo` de Pagamentos exige regex completa. Fiscalização aceita processo parcial não vazio, inclusive referência selecionada. SICAF e Planejamento são texto livre; referência de Planejamento é opcional. |
| VAL-G05 | Pendente: `formatarCnpj` local difere — Fiscalização mascara progressivamente; Ofícios formata apenas a saída ao obter 14 dígitos. Nenhum valida formato completo ou DV. Decisão formato versus formato+DV segue aberta no backlog. |
| VAL-G06 | Pendente: não há parser/formatador monetário compartilhado. Pagamentos concatena `R$` após validar sintaxe; Conta Vinculada concatena texto sem regra monetária. Não há cálculo monetário nesses fluxos. |
| VAL-PAG-01 | Confirmado: `2000` passa, mas não vira `2.000,00`; `2000,5` e `15000.5` são rejeitados por `erroDoCampo`. |
| BUG-PAG-02 | Causa confirmada: `window.onload` não chama geração; wrapper nasce hidden e estado vazio é explícito. Data é preenchida, mas processo/descrição/mês/valor não; não há dados padrão suficientes para geração validada na abertura limpa. Não é falha comprovada do renderizador. |
| BUG-OFI-01 | Confirmado: `alternarModoEscuro` só altera classe/rótulo, sem chave ou restauração. Mesmo trabalho de BUG-G01. |
| VAL-OFI-02 | Pendente: `numeroOficio` rotulado opcional, sem required; `erroDoCampo` não bloqueia vazio. Documento usa marcador e download `Sem_Numero`. |
| VAL-OFI-03 | Pendente no SICAF: `processoSicaf` só exige preenchimento quando ativo. Conta Vinculada não possui processo; não criar campo por inferência. |
| VAL-CV-01 | Pendente: `cnpjConta` exige apenas preenchimento; formata na montagem, sem máscara de digitação/validação completa. |
| VAL-CV-02 | Pendente: `valorConta` obrigatório textual; `montarDocumento` usa `valor()` para escape HTML, não parsing monetário. |
| VAL-SIC-01 | Pendente: `cnpjSicaf` tem a mesma lacuna de Conta Vinculada. |
| VAL-SIC-02 | Mesma lacuna de VAL-OFI-03; preservar `alternarProcessoSicaf` e dispensa/limpeza por S/N. |
| FEAT-PLA-01 | Ausente: formulário/template de Planejamento só nomeiam equipe; não existem finalidade, portaria original ou substituições. Modelo de alteração precisa ser definido especificamente, não copiado de Fiscalização. |
| VAL-PLA-02 | Pendente: `numPortaria` opcional e não exigido em `erroDoCampo`; condição “quando aplicável” não está definida no código. |
| FEAT-PLA-03 | Parcial/necessita delimitação: `atualizarMembro` já alimenta o array e `montarDocumento` usa função/nome na tabela, sem segundo cadastro. Não atualiza a prévia a cada digitação; alteração ainda inexistente. Não foi encontrada duplicação atual de cadastro Presidente/Membro. |
| BUG-FIS-01 | Parcialmente confirmado: `alternarFinalidadePortaria` esconde `opcoesContrato`/`opcoesEmpenho`, mas não `secaoEquipe` nem sua tabela. `alterarTipoPortaria` pode reexibir opções por ignorar finalidade. Não desaparece toda a equipe. |
| FEAT-FIS-02 | Parcial: funções da composição são papéis fixos de `definirMembros`; apenas alterações possuem select. `renderizarAlteracoes` oferece oito funções de Contrato até para Empenho. |
| BUG-FIS-03 | Não confirmado como obrigatoriedade atual: `sincronizarCampos` exige `objeto` somente em nova portaria. Na alteração permanece visível, opcional e ausente do texto. Decidir manter/ocultar/incluir depende do modelo, não somente do formulário. |
| FEAT-FIS-04 | Ausente: designado/função/substituído ficam no DOM de alterações; listeners do array `membros` só recebem campos de `membros-container`. Não há sincronização; substituições nem possuem SIAPE próprio. |
| BUG-FIS-05 | Causa estrutural confirmada: fieldset do último membro e fieldset externo `secaoEquipe` têm `proad-fieldset`; ambos recebem border-bottom em `styles.css`, antes do CTA. Não existe segundo `<hr>` a remover. |
| FEAT-FIS-06 | Ausente: apenas um `tipoNumero`, uma empresa/CNPJ e um array `membros`; alterações sem contrato/id/SIAPE/tipo; uma tabela de equipe. Digitar vários números no campo único não cria entidades independentes. |

### Fiscalização — modelo, geração e exportação

1. **Dados:** valores gerais lidos diretamente de IDs únicos; `membros` guarda `papel`, `nota` e, após input, `nome`/`siape`. Alterações são lidas do DOM só ao gerar o Art. 1º. Não há coleção `contratos`, IDs estáveis de contrato/membro, associação de alteração ou modelo persistido completo.
2. **Nova portaria:** exige data, tipo, finalidade, número do instrumento, empresa, CNPJ, objeto, processo (exceto S/N) e nomes/SIAPEs da equipe. Número da portaria é opcional. Máscaras não garantem completude de CNPJ/processo. Referências marcadas continuam opcionais e produzem marcadores quando vazias.
3. **Alteração:** exige portaria original, designado/função/substituído e equipe completa, além dos dados gerais. CNPJ obrigatório só em Contrato, por constar na tabela; processo/objeto dispensados. Quantidade de alterações limitada a 1–10; incisos usam array literal I–X, não conversão genérica. Não há modalidades de alteração além da redação de substituição existente.
4. **Composição/funções:** Contrato tem gestor, fiscal técnico e administrativo, seus substitutos e opcionalmente 1–10 fiscais setoriais com substitutos (6–26 pessoas). Empenho tem gestor titular/substituto, podendo acrescentar fiscal titular/substituto (2/4). `renderizarMembros` reinicia dados ao trocar tipo/finalidade/configuração; `renderizarAlteracoes` perde preenchimento ao recriar quantidade. As oito opções de alteração não filtram Empenho.
5. **Contrato/empresa/CNPJ:** únicos e globais em `tipoNumero`, `empresa`, `cnpj`; usados por `montarDocumento`, `gerarArtigoUmAlteracao`, `gerarTabelaEmpenho` e validação. CNPJ progressivo limita a 14 dígitos; não verifica DV.
6. **Art. 1º:** nova portaria interpola um instrumento, empresa, CNPJ, processo e objeto. Alteração menciona um instrumento/empresa e uma portaria original; não usa CNPJ/processo/objeto no artigo nem identifica contrato em cada inciso. Texto e dados são montados juntos; `esc` apenas trim/fallback, sem escape HTML.
7. **Tabelas:** Contrato gera uma `doc-table` com empresa/CNPJ em célula colspan=3, colunas NOME/SIAPE/FUNÇÃO e notas. Não há título com número de contrato nessa tabela. Empenho usa cinco colunas, papéis por posição do array e rowspan no modo quatro pessoas. Tabela existe nas duas finalidades; artigos 2º/3º e finais são gerados separadamente.
8. **Prévia/paginação:** `montarDocumento` espera decode dos logos (falhas ignoradas), remove escala para medir e chama `paginar`. Nós de topo inteiros passam à próxima folha quando excedem `scrollHeight/clientHeight`; tabela, lista ou parágrafo maior que folha não é subdividido. Não há cabeçalho repetido, numeração de páginas ou reserva separada da área útil inferior. A4 210 × 297 mm, padding 25 mm, Times 12 pt/1,5, overflow hidden.
9. **PDF:** `exportPDF` captura apenas `preview-content` via html2pdf, A4 retrato, margem conversor zero, canvas 2, JPEG 0,98; `.pdf-export` elimina gap, aplica quebra entre folhas e altura `calc(297mm - 1px)`. Remove transform; `baixarDocumento` bloqueia edição por inert e restaura classe, escala, editabilidade e controles em finally inclusive em falha. Nome usa número ou XX e ano 2026 literal. O conversor não recupera conteúdo já cortado no DOM.
10. **DOCX:** clona prévia, remove marcação auxiliar de links e incorpora imagens por fetch/FileReader. Usa CSS Word reduzido e `htmlDocx.asBlob(html)` sem opções A4/margens; o innerHTML não inclui o transform do contêiner. Classes das folhas não recebem regras de tamanho/quebra no HTML Word. Não há garantia de paginação igual ao PDF; o formato Letter foi registrado nos testes históricos, não reaberto nesta fase.

Nos demais geradores o mecanismo PDF/Word é semelhante, com diferenças de CSS e nomes. Pagamentos e Planejamento também paginam por blocos; Ofícios cria uma única folha (11 pt/1,35) e assinatura absoluta a 27 mm do fundo. Pagamentos não aguarda explicitamente decode dos logos. Planejamento aguarda, usa tabela com padding 6 px (Fiscalização 5 px), prazo normalizado e DOCX com `5` literal adicional no nome.

### Portaria 508 — evidência estrutural, não novo template

O PDF local foi extraído e renderizado integralmente: quatro páginas de aproximadamente 595,32 × 841,92 pt (A4), cabeçalho institucional repetido e números de página. Há seis blocos de composição identificados por contrato, com 8/12/8/10/8/12 pessoas, colunas SERVIDOR/SIAPE/FUNÇÃO e seis incisos I–VI associando substituições aos contratos. Um servidor aparece em funções diferentes conforme o contrato. São observações da referência, não limites de quantidade ou dados a cadastrar automaticamente.

- Página 1: Art. 1º, seis alterações, primeira composição e início da segunda.
- Página 2: continuação da segunda composição, terceira/quarta/quinta e título da sexta.
- Página 3: cabeçalho de colunas/linhas da sexta composição e artigos 2º–4º.
- Página 4: artigo 5º e assinatura.

A continuação da segunda composição não repete o cabeçalho de colunas; o título da sexta fica separado de suas linhas pela quebra. Essas quebras observadas não são requisitos a copiar. O PDF comprova a necessidade de continuação entre páginas; não determina estrutura DOM nem algoritmo do gerador.

**Não há empresa/CNPJ no Art. 1º da referência.** A inclusão de cada relação contrato → empresa → CNPJ, o plural e o modelo com IDs são requisitos do backlog/AGENTS, não regras extraídas da Portaria 508. A referência de alteração não define automaticamente a redação de nova portaria, alterações de Planejamento, múltiplos Empenhos ou um catálogo novo de tipos de alteração.

### Impacto necessário para múltiplos contratos — apenas proposta

| Camada atual | Mudança futura necessária / limites |
| --- | --- |
| IDs globais e `membros` único | Coleção de contratos com identidade estável, número, empresa, CNPJ, equipe e alterações próprias. Dados gerais da portaria permanecem separados. Não usar índice visual como identidade nem arrays compartilhados por referência. |
| Formulário/recriação | Grupos repetíveis com adicionar/remover, IDs/labels/erros únicos; preservar dados dos demais contratos e tratar remoção com alterações associadas. Reaproveitar componentes visuais, não copiar o cadastro de pagamentos. |
| Funções/composição | Seleção limitada a papéis confirmados no modelo adequado; mesmo servidor pode exercer papéis diferentes por contrato. Definir sincronização explícita de substituição e equipe, sem sobrescrever outro contrato ou assumir correspondência só por nome. |
| Alterações | Relacionar contrato, designado, SIAPE, função, substituído e tipo; substituir I–X fixo por numeração extensível. Tipos permitidos, conflitos e cardinalidade da portaria original precisam ser definidos antes de implementação; não inventar opções. |
| Art. 1º | Separar leitura/modelo e composição textual; singular/plural e cada relação instrumento/empresa/CNPJ inequívoca. Validar redação de nova/alteração e destino de processo/objeto — hoje únicos, sem regra definida por contrato no backlog. |
| Tabelas e artigos | Uma composição identificada por contrato; notas/definições devem corresponder às funções efetivas. Preservar regra de Empenho até solicitação específica. |
| Paginação | Suportar várias tabelas e continuação de linhas, proteger associação título/tabela e área útil, considerar cabeçalho/número de página da referência sem copiar suas quebras. Uma tabela maior que folha já excede a capacidade atual. |
| PDF/DOCX | Verificar todas as relações e linhas nas duas saídas, independentemente de zoom; CSS Word e regras de quebra exigem análise própria. Não presumir que PDF correto garante Word correto. |

### Duplicações e riscos prioritários

Já compartilhados: toast/status/erros/foco, zoom/fullscreen, máscara de processo e scrollbar. Restam controladores de geração/download e validação parecidos nos quatro HTMLs; conversão de imagens/Word/PDF; meses/datas; tema; HTML de header/toolbar; A4/export CSS; paginação por blocos em três geradores. Há diferenças reais em required, datas, `esc`, CNPJ, nomes de arquivos, estilos/tabelas e inicialização: não extrair cegamente. CSS legado e atual coexistem; fieldsets aninhados explicam bordas acumuladas.

Riscos principais: perda de dados na recriação de Fiscalização; associação incorreta entre contrato/empresa/equipe ao ampliar o modelo; cortes de tabelas/listas e assinatura fixa de Ofícios; Word sem opções A4; HTML interpolado sem escape em Pagamentos/portarias; dependências CDN/fetch/localStorage; ano 2026 literal; divergência de tema; validações incompletas. Datas iniciais já usam componentes locais — o risco histórico de inicialização UTC não se confirma no código atual. Conteúdo institucional e paginação não foram alterados.

### Arquivos potencialmente afetados por fase (não executadas)

Mapa de impacto, não lista obrigatória de alterações. Todos os trabalhos funcionais exigirão casos pertinentes em `docs/TESTES.md`; arquitetura só quando necessária. Recursos de imagem e PDF de referência permanecem de leitura.

| Fase do Roadmap de Implementação | Arquivos/camadas previstos |
| --- | --- |
| 0 — Auditoria | Somente `docs/ARQUITETURA.md` e `docs/TESTES.md`, nesta tarefa. |
| 1 — Validações/formatadores | `assets/js/formatters.js` e quatro geradores: integração respeitando campos existentes; definir regra de CNPJ antes de DV. |
| 2 — Comportamentos globais | `assets/js/ui.js`, cinco HTMLs; `styles.css` se diferenciar Tema/Portal. Rever migração das três chaves de tema. |
| 3 — Design System | Principalmente `styles.css`; avaliar base já existente, sem recriá-la. |
| 4 — Piloto Pagamentos | `pagamentos.html`, formatadores compartilhados; prévia inicial condicionada a dados suficientes. |
| 5 — Mobile/preview | `styles.css`, `assets/js/preview.js` e integrações nos quatro geradores; não alterar A4 para caber na tela. |
| 6 — Fiscalização atual | `portarias_fiscalizacao.html`; `styles.css` somente para separadores com escopo adequado. Sem múltiplos contratos. |
| 7 — Múltiplos contratos | `portarias_fiscalizacao.html`: dados, formulário, validação, artigos, tabelas, paginação e revisão PDF/Word; `styles.css` apenas se necessário para grupos repetíveis. Novo módulo local só se a complexidade justificar. |
| 8 — Planejamento | `portarias_planejamento.html`; modelo específico de alteração a definir. |
| 9 — Ofícios/SICAF/Conta | `oficios.html`, helpers compartilhados pertinentes; evitar duplicar trabalhos das fases 1/2. |
| 10 — Padrão visual | `oficios.html`, `portarias_fiscalizacao.html`, `portarias_planejamento.html`, `styles.css`; verificar adoção atual antes de alterar. |
| 11 — Portal | `index.html`, `styles.css` e integração do tema compartilhado, sem dashboard. |
| 12 — Consolidação | Quatro geradores e `assets/js/{ui,preview,formatters}.js`, `assets/css/generators.css`, `styles.css`, conforme equivalência comprovada; sem exportador genérico obrigatório. |
| 13 — Acessibilidade | Cinco HTMLs, `styles.css`, UI/preview compartilhados e campos dinâmicos novos. |
| 14 — Regressão | `docs/TESTES.md`; código somente para regressões confirmadas, sem novas funcionalidades. |

## Histórico anterior à reauditoria

As fases abaixo conservam sua numeração original e evidências da época; não indicam implementação das fases homônimas do novo Roadmap de Implementação.

## FASE 8 — Acessibilidade global (17/09/2026)

As cinco páginas oferecem um link inicial “Pular para o conteúdo principal”, visível ao receber foco, apontando para `main#conteudo-principal` com `tabindex="-1"`. Não há tabindex positivo. Labels, fieldsets, selects, checkboxes, botões e links nativos existentes permanecem; as ajudas de número do ofício, prazo e quantidade setorial agora integram o `aria-describedby` dos respectivos campos.

`styles.css` escurece o texto secundário claro para `#5b6b81` e a borda de controles clara para `#64748b`. Os tokens escuros permanecem. O viewport tem foco branco sobre o fundo cinza, inclusive quando uma folha editável recebe foco; o link documental tem outline azul apenas quando focado na prévia. Outlines não alteram medidas ou paginação. O portal continua sem controle de tema.

`ui.js` oferece `preservarFocoOperacao()`, usado pelos quatro controladores locais: restaura o elemento anterior quando desabilitar os controles fez o navegador perder o foco, sem sobrepor uma navegação do usuário para outro elemento. Ao fechar uma notificação focada, o foco retorna ao controle anterior disponível ou ao main. O timer de 4,5 segundos não esconde uma notificação enquanto seu botão está focado. Erros continuam persistentes. `toast-announcement` é uma região `role="status"` permanente, contendo somente tipo/mensagem; o botão de fechar permanece fora da região anunciada.

`preview.js` anuncia mudanças explícitas de zoom em `preview-status`, também `role="status"`, sem anunciar continuamente resize. Ao entrar em fullscreen, preserva e ativa inert nos ramos externos ao visualizador e foca o botão de saída; Tab/Shift+Tab circulam pelos controles, folhas e links do painel. Ao sair, restaura os estados inert anteriores e o foco no botão. Escape continua usando os handlers locais existentes.

Tema e fullscreen conservam seus rótulos de próxima ação (Modo claro/escuro; Tela cheia/Sair da tela cheia); deixam de usar `aria-pressed`, evitando a combinação ambígua de rótulo variável com estado de botão toggle. Ajustar à largura conserva `aria-pressed`, pois seu rótulo é fixo e representa um modo ativo.

Links originalmente sem tabindex recebem `tabindex="0"`, `contenteditable="false"` e `data-proad-keyboard-link` somente no DOM da prévia, pois o navegador os pulava dentro de contenteditable e Enter podia editar o parágrafo em vez de abrir o link. A marcação guarda o atributo contenteditable original. `limparMarcacaoPreview(clone)`, chamado pelos quatro preparadores de HTML Word, restaura esse atributo e remove tabindex/marcação auxiliares do clone. Somente o trecho do link deixa de ser editável na visualização; as folhas continuam editáveis. Templates institucionais, conteúdo, dimensões A4, CSS documental inline, paginadores e opções de exportação permanecem; testes e limites estão na seção FASE 8 de TESTES.md. Não houve execução da FASE 9.

## FASE 7 — Extração compartilhada (17/09/2026)

Esta seção registra a estrutura atual após a consolidação; as seções seguintes preservam o histórico das auditorias e migrações. Não houve alteração de regras administrativas, templates, paginação ou exportadores. O portal e `styles.css` permaneceram intactos.

### Análise e limites da extração

| Código analisado nos quatro geradores | Decisão e motivo |
| --- | --- |
| Toast, status, indicação de erro e rótulo do tema | Compartilhados: mesmo DOM e comportamento. A validação que decide quais campos exigir continua local. |
| Zoom e fullscreen | Oito funções equivalentes extraídas, com seus três estados de visualização. Inicialização, listeners e momento de geração continuam em cada página. |
| Máscara de processo | Compartilhada apenas entre Pagamentos e Fiscalização: mesma limitação a 17 dígitos e pontuação progressiva. Ofícios e Planejamento mantêm processo livre. |
| Persistência de tema e numeração | Local: chaves, gravação/restauração e tratamento de falhas diferem. Ofícios continua sem persistência de tema. |
| Datas, CNPJ, `esc` e número por extenso | Locais: datas de Ofícios usam dia com zero e `dataCurta` também retorna extenso; CNPJ tem tratamento diferente para entrada parcial; `esc` de Ofícios escapa HTML, enquanto outros usam trim/fallback; limites do número por extenso diferem. |
| CSS de scrollbar | Regras idênticas extraídas para uma folha carregada somente pelos geradores, preservando inclusive o seletor global original. |
| CSS A4, tabelas, assinaturas e exportação | Mantido local: fontes, espaçamentos, padding e posicionamento diferem. Ofícios tem assinatura absoluta e folha única; os paginadores das demais páginas movem blocos inteiros. Mesmo regras semelhantes podem afetar medidas e quebras. |
| PDF e conversão DOCX | Locais: nomes, HTML Word, preparação e restauração de estado pertencem a cada gerador. Não foi criado exportador genérico. |

### Arquivos e carregamento

- `assets/js/ui.js`: `mostrarAlerta`, `fecharAlerta`, `definirStatus`, `definirErroCampo` e `atualizarBotaoTema`. Toast conserva tipos, duração de 4,5 segundos, cancelamento do timer anterior e erro persistente até fechamento/substituição.
- `assets/js/preview.js`: ajuste à largura, zoom manual, reset, percentual e fullscreen nativo/alternativo. Conserva `zoomPreview`, `ajustarPreview` e `framePreview`; não modifica conteúdo ou medidas das folhas.
- `assets/js/formatters.js`: `formatarProcesso` e `formatarProcessoCampo`, carregados somente em Pagamentos/Fiscalização.
- `assets/css/generators.css`: scrollbar WebKit de 8 px e suas cores/hover originais. Não é carregado no portal, evitando alterar sua rolagem.

Os JavaScripts são scripts clássicos, carregados em ordem antes do script inline de cada gerador, sem `async`, `defer`, módulos ou build. As funções permanecem acessíveis aos handlers inline existentes. Cada página tem sua própria instância do estado de zoom. Os scripts e o CSS compartilhados carregam também por `file://`; isso não elimina as restrições anteriores de fetch de imagens para DOCX nesse protocolo.

### Contratos e riscos preservados

`ui.js` depende de `customAlert`, `alertTitle`, `alertMessage`, `document-status`, `tema-toggle`, `body.dark-mode` e do par `id`/`id-erro` de cada campo validado. As classes de toast e os atributos ARIA continuam os mesmos. Não houve alteração das chaves `sistema_pagamentos_modo_escuro`, `sistema_fiscalizacao_modo_escuro` e `sistema_portarias_modo_escuro`.

`preview.js` depende de `preview-content`, `preview-zoom-wrapper`, `preview-viewport`, `zoom-indicador`, `zoom-ajustar`, `visualizador` e `preview-fullscreen`. Mantém `.proad-preview-expanded`/`.proad-preview-open` no fullscreen alternativo. O bloqueio por `.pdf-export` impede reaplicar transform durante a captura; o wrapper oculto de Pagamentos continua sendo respeitado. O estado inicial vazio de Pagamentos e a geração inicial dos demais não foram unificados.

O CSS documental inline e os corpos das funções específicas foram comparados com a versão anterior. Permanecem limites de blocos indivisíveis, folha única de Ofícios e diferenças entre DOCX e PDF. Ao publicar, é necessário enviar os quatro novos recursos junto dos HTMLs: o carregamento dos helpers passa a ser uma dependência local obrigatória. A FASE 8 não foi executada.

## FASE 0 — Auditoria global (16/09/2026)

Registro do código existente, sem mudanças funcionais. Foram lidos integralmente `AGENTS.md`, `docs/UX_UI_ROADMAP.md`, arquitetura, testes, os cinco HTMLs e `styles.css`; foram também inventariadas e visualizadas as três imagens de `assets/` e `img/`.

As constatações vêm da inspeção do código. Riscos de layout, paginação e compatibilidade de arquivos não equivalem a resultados de testes em navegador ou Word. Roteiros em [TESTES.md](TESTES.md).

## Estrutura e dependências

Aplicação estática com páginas HTML independentes, CSS e JavaScript embutidos. Não há backend, framework SPA, módulos JavaScript compartilhados, manifesto de dependências, build ou suíte de testes no inventário atual. `assets/` contém somente `logo_proad.png`; `img/` contém somente `logo_br.png` e `logo_ufrr.png`.

| Arquivo/recurso | Responsabilidade confirmada |
| --- | --- |
| `index.html` | Portal com quatro links relativos para os geradores; sem JavaScript, formulário, preview, exportação, zoom ou controle de tema. |
| `pagamentos.html` | Autorizações para pagamento de Bolsa e Nota Fiscal. |
| `oficios.html` | Ofícios SICAF e Conta Vinculada. |
| `portarias_fiscalizacao.html` | Portarias novas ou de alteração, para Contrato ou Empenho, com equipes configuráveis. |
| `portarias_planejamento.html` | Portarias de nomeação de equipe de planejamento, referências opcionais e prazo. |
| `styles.css` | Interface compartilhada: header, campos/foco, tema, toolbar, membros e aviso. Importado nas cinco páginas. |
| `assets/logo_proad.png` | PNG de 640 × 640 usado como favicon nas cinco páginas; declarado como `image/x-icon`. |
| `img/logo_br.png`, `img/logo_ufrr.png` | PNGs de 132 × 136 e 136 × 148; brasão e logo nos quatro documentos, também buscados para DOCX. |

Os quatro geradores carregam os mesmos scripts externos:

- `https://cdn.tailwindcss.com`: utilitários de layout, dimensões, tipografia, cores e `hidden`; URL sem versão fixada.
- `https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js`: PDF, com opções de html2canvas e jsPDF.
- `https://unpkg.com/html-docx-js/dist/html-docx.js`: DOCX; URL sem versão fixada.

Não há cópias locais dessas bibliotecas nem atributos de integridade nos scripts. O portal não carrega esses CDNs. Fiscalização inclui no Art. 3º um link para um memorando no Google Drive: referência navegável, não dependência de execução. Disponibilidade externa não foi verificada nesta auditoria do código local.

## Contratos comuns de DOM e estado

Cada gerador possui funções globais e handlers inline (`onclick`, `onchange` e alguns `oninput`). Renomear IDs/remover classes exige revisar funções e seletores CSS.

| ID/classe | Uso nos quatro geradores |
| --- | --- |
| `preview-content`, `.a4-document` | Destino do template, elemento escalado e origem do PDF e do clone para DOCX. |
| `preview-zoom-wrapper`, `.preview-zoom-wrapper` | Reserva largura/altura calculadas por `offsetWidth/offsetHeight × zoomPreview`. |
| `.a4-page` | Folha editável, dimensão física, margens, tipografia e corte de overflow. |
| `.pdf-export` | Retira espaçamento entre folhas e ativa quebras CSS no PDF. |
| `zoom-indicador` | Percentual e botão de restauração para 100%. |
| `tema-toggle`, `.dark-mode` | Botão na toolbar e classe no body; ofícios não atualiza texto do botão. |
| `customAlert` | Aviso temporário. Pagamentos/portarias usam `alertMessage`, `role="status"` e `aria-live="polite"`; ofícios busca o `p` interno e não tem esses atributos ARIA. |
| `.hidden` | Oculta grupos condicionais e avisos por meio do Tailwind. |
| `.app-page`, `.preview-toolbar` | Escopo compartilhado; portal usa `.portal-page`. |

Todos geram prévia no `window.onload`, inclusive com placeholders. Não há estado inicial vazio, validação completa antes de gerar/baixar, quatro tipos de toast, carregamento ou bloqueio de downloads em andamento. Não há fluxo de submissão de `<form>` acionando validação nativa.

Folhas são `contenteditable`. Gerar novamente substitui `innerHTML` e perde edições manuais; editar não atualiza formulário, não salva dados nem repagina. Exportações usam a prévia existente, mas nomes de arquivo podem usar campos já alterados: nome e conteúdo podem divergir sem nova geração.

### PDF — implementação comum

`exportPDF()` verifica HTML não vazio, adiciona `.pdf-export`, remove temporariamente transform e exporta só `preview-content`. Usa margem zero no conversor (25 mm vêm do padding da folha), JPEG qualidade 0,98, canvas escala 2 com useCORS, A4 retrato e `pagebreak: { mode: ["css"] }`.

CSS de exportação: display block, sem gap, altura `calc(297mm - 1px)` e quebra após cada folha, exceto a última. Ajuste de 1 px faz parte do comportamento atual. Toolbar/header estão fora do elemento exportado; sombra de `.a4-page` não é removida explicitamente.

Restauração de classe/zoom existe apenas em `.then()`: sem catch/finally ou checagem de html2pdf. Falhas podem deixar o preview no estado de exportação. Nas portarias, o contêiner passa de contenteditable false para true após sucesso sem restaurar o valor original; folhas filhas continuam explicitamente editáveis durante a operação.

### DOCX — implementação comum

`prepararHtmlWord()` clona a prévia, busca imagens por fetch/new URL relativo a document.baseURI e converte blobs em Data URLs por FileReader. `exportWord()` verifica window.htmlDocx, chama `htmlDocx.asBlob(html)` sem opções de página/margens, cria link de download e revoga Object URL.

HTML enviado tem CSS próprio reduzido; não leva styles.css nem todo o CSS local. Não inclui tamanho/quebras de `.a4-page`. O código não garante equivalência de paginação A4, margens e aparência com PDF. Não há response.ok ou tratamento de falha de fetch/conversão. Uso direto por file:// é cenário de risco para busca de imagens; deve ser distinguido do uso por HTTP.

### Zoom e dimensões comuns

Zoom começa em 100%, muda em passos de 10% entre 50% e 150%. `atualizarZoom()` aplica scale com origem top center e dimensiona wrapper. Não calcula escala por largura disponível; não existem ajustar à largura/página ou fullscreen. Só ofícios registra resize, reaplicando a escala atual.

Folhas: 210 × 297 mm, padding 25 mm, border-box, overflow hidden e Times New Roman. Largura física é própria do documento e deve permanecer; riscos estão na acomodação pelo visualizador e corte do conteúdo excedente.

## Pagamentos

### Campos e JavaScript específico

| IDs | Finalidade / dependência |
| --- | --- |
| `processo`, `semProcesso` | Máscara de até 17 dígitos por formatarProcessoCampo; alternarProcesso desabilita, limpa e muda placeholder para S/N. |
| `dataDocumento` | Data por extenso em formatarData. |
| `tipoPagamento` | Bolsa/Nota Fiscal; controla alternarTipoPagamento. |
| `campoBolsa`, `descricaoBolsa` | Grupo/descrição da bolsa. |
| `campoEmpresa`, `empresa` | Grupo/empresa de Nota Fiscal. |
| `campoMes`, `mesReferencia` | Grupo/mês (type=month) somente para Bolsa; formatarMes. |
| `valor` | Texto livre interpolado após R$; sem parsing, validação ou formatação monetária. |

`alternarTipoPagamento()` só troca grupos, não regenera. `gerarDocumento()` monta cabeçalho, processo/data, autorização e assinatura, agenda paginar por requestAnimationFrame e mostra sucesso antes da paginação. `esc()` só faz trim/fallback, não escape HTML.

### CSS, preview, paginação e exportações

CSS local: A4/zoom/exportação, `.payment-title`, `.payment-signature`, parágrafos e scrollbar. Folha 12 pt/1,5; assinatura no fluxo com margem superior de 120 pt. `paginar()` move nós inteiros quando scrollHeight > clientHeight, sem dividir parágrafos/tabelas/listas.

PDF: `Aut_Pagamento_<identificador>.pdf`; usa processo ou, em S/N, descrição da bolsa/empresa (fallback Sem_Identificacao), sanitizando caracteres para `_`. Nome não acrescenta literalmente S/N. DOCX: `Autorizacao_Pagamento.docx`, fixo; CSS Word não define payment-title/payment-signature.

Tema persiste em `sistema_pagamentos_modo_escuro`; campos do pagamento não persistem. CSS compartilhado e zoom seguem seções comuns, sem listener de resize.

Riscos: interpolação HTML, valores sem normalização, assinatura deslocada, blocos grandes cortados, duas colunas processo/data no celular, labels sem for e falta de ajuste à largura. Header ainda diz “Sistema de Geração de Portarias”.

## Ofícios

### Campos e JavaScript específico

| IDs | Finalidade / dependência |
| --- | --- |
| `tipoOficio`, `numeroOficio`, `dataDocumento` | Modelo sicaf/conta, número/data; alternarModelo mostra grupos e já gera documento. |
| `camposSicaf` | empresaSicaf, cnpjSicaf, emailSicaf, processoSicaf, semProcessoSicaf. |
| `camposConta` | empresaConta, cnpjConta, valorConta, eventoConta, contratoConta, bancoConta, agenciaConta, contaCorrente, diaEmail, descricaoConta. |

`valor()`/`esc()` escapam HTML; formatarCnpj formata na geração quando obtém 14 dígitos, sem validar dígitos verificadores. Processo SICAF é texto livre sem máscara; alternarProcessoSicaf limpa/desabilita ao marcar S/N. Conta Vinculada não tem processo/S/N. dataExtenso/dataCurta produzem datas por extenso, inclusive e-mail. Valor financeiro é texto livre.

`salvarNumeroOficio()` grava a cada input e geração em `sistema_oficios_ultimo_numero`; apagar remove a chave. header/assinatura são funções próprias. Cabeçalho traz ano literal 2026.

### CSS, preview, paginação e exportações

CSS local: `.oficio-header`, `.institution`, `.oficio-meta`, `.oficio-recipient`, `.oficio-table`, `.oficio-signature`, base A4. Folha 11 pt/1,35, tabela bancária 10 pt; assinatura absoluta bottom 27 mm, fora do fluxo. Metadados usam tabela fixa e quebra de palavras.

Gerar cria exatamente uma `.a4-page`; não há função de paginação. Excedente fica sujeito a overflow hidden e pode alcançar assinatura; regras PDF não criam novas folhas para acomodar esse conteúdo.

PDF/DOCX: `Oficio_<tipoOficio>_<numero sanitizado>`, fallback Sem_Numero. Word usa margem de 110 pt na assinatura em vez de posição absoluta; CSS não replica integralmente cabeçalho, imagens e espaçamentos.

Tema só alterna dark-mode, sem persistência ou troca de rótulo. Aviso dura 3 s, não cancela timers anteriores e não tem região viva. Zoom comum, com resize; CSS compartilhado conforme seção comum.

Riscos: folha única/assinatura, troca de modelo perde edições da prévia, grades duplas no celular, processo/valor sem validação, diferença do DOCX e tema. Labels estáticos têm for (checkbox S/N envolvido por label).

## Portarias de fiscalização

### Campos e JavaScript específico

| IDs / seletores | Finalidade / dependência |
| --- | --- |
| `numPortaria`, `dataDocumento`, `ultimoNumero` | Número, data, indicador de número salvo ao gerar. |
| `tipoPortaria`, `tipoNumero` | Contrato/Empenho e número do instrumento; alterarTipoPortaria. |
| `finalidadePortaria`, `camposAlteracao`, `portariaOriginalAlteracao`, `quantidadeAlteracoes`, `alteracoesMembros` | Nova/alteração e 1–10 substituições; alternarFinalidadePortaria/renderizarAlteracoes. |
| `.alteracao-membro`, data-campo designado/funcao/substituido | Lidos em gerarArtigoUmAlteracao; nomes em maiúsculas. Select oferece oito funções de contrato, também para Empenho. |
| `empresa`, `cnpj`, `processo`, `semProcesso`, `objeto` | Instrumento; máscaras CNPJ/processo sem validação completa; S/N limpa/desabilita processo. |
| `usarDataEmail`, `dataEmail`, `usarProcessoReferencia`, `processoReferencia`, `usarDespacho`, `despacho`, `usarTexto`, `textoPersonalizado` | montarReferencias; checkboxes controlam inclusão no texto, não visibilidade dos inputs. |
| `opcoesContrato`, `incluirFiscalSetorial`, `quantidadeFiscalSetorial` | 1–10 fiscais setoriais e seus substitutos; limite em obterQuantidadeFiscaisSetoriais. |
| `opcoesEmpenho`, `quantidadeEmpenho` | Equipe com 2/4 pessoas. |
| `secaoEquipe`, `membros-container`, data-index, data-campo nome/siape | Campos dinâmicos com listeners input atualizando array membros por índice. |

`definirMembros()` monta papéis; `renderizarMembros()` recria array e inputs vazios. Trocar tipo, finalidade ou configuração de fiscais perde dados. `renderizarAlteracoes()` também recria campos vazios ao mudar quantidade/reabrir alteração.

Em alteração, equipe continua visível e tabela continua no template; CNPJ/processo/objeto continuam no formulário, embora o Art. 1º de alteração não os use. Trocar tipo depois de selecionar alteração pode reexibir opções de equipe: alterarTipoPortaria não considera finalidade. São constatações, não decisão de corrigir regras administrativas.

gerarLinhasTabela, gerarTabelaEmpenho e gerarArtigo... produzem os blocos: Contrato tem tabela de três colunas/notas; Empenho cinco colunas e rowspan com quatro pessoas. Alteração inclui itens I–X e artigos finais próprios. numeroPorExtenso está definido sem chamadas. `esc()` só faz trim/fallback.

### CSS, preview, paginação e exportações

CSS local: A4, `.doc-table`, `.company-cell`, `.role`, `.empenho-table` e classes de colunas/nome/rótulo, tema e aviso. Corpo 12 pt/1,5; Empenho 11 pt e overflow-wrap:anywhere. Gerar agenda paginar por frame e avisa sucesso antes de executar; blocos inteiros, inclusive tabelas/listas, são movidos para novas páginas.

PDF/DOCX: `Portaria_Fiscalizacao_<numero ou XX>-2026`; número sem sanitização própria. CSS Word é genérico, sem regras de Empenho. Tema: `sistema_fiscalizacao_modo_escuro`; número: `sistema_fiscalizacao_ultimo_numero`, salvo só ao gerar se não vazio, restaurado no onload. Membros não persistem; número não tem listener de input. Zoom comum sem resize; CSS compartilhado complementa/sobrepõe o local.

Riscos: perda de dados nas transições; até 26 pessoas numa tabela indivisível; listas extensas; interpolação HTML; membros/alterações identificados apenas por placeholders; duas colunas nome/SIAPE no celular e inconsistência finalidade/opções.

## Portarias de planejamento

### Campos e JavaScript específico

| IDs / estado | Finalidade / dependência |
| --- | --- |
| `numPortaria`, `ultimoNumeroPortaria`, `dataDocumento` | Número, indicador e data. |
| `usarDataEmail`, `dataEmail`, `usarProcessoEletronico`, `processoEletronico`, `usarDespachoEletronico`, `despachoEletronico`, `usarTextoPersonalizado`, `textoPersonalizado` | Quatro referências opcionais em montarReferenciasDocumento; inputs sempre visíveis. |
| `descContratacao`, `centroCusto`, `prazoPortaria` | Descrição, centro de custo, prazo numérico inicialmente 30. |
| `membros-container`, array membros | Nome, função Presidente/Membro, SIAPE e setor, handlers inline por índice/campo. |

Não há S/N específico, máscara de processo ou campo empresa. renderizarFormularioMembros inicia Presidente + três Membros; adicionarMembro/removerMembro/atualizarMembro gerem array. Primeiro índice não pode ser removido, mas função é editável; outros também podem selecionar Presidente. Atualização ocorre em change, não input.

Gerar coloca nomes em maiúsculas, monta referências/tabela/artigos/assinatura. Prazo: `Math.max(1, parseInt(valor,10) || 30)`; numeroPorExtenso cobre até 999 e retorna número como texto acima disso. Dados são interpolados sem escape HTML, inclusive atributos value na renderização de membros.

### CSS, preview, paginação e exportações

CSS local: A4, `.doc-header` (sem uso no template atual), `.doc-table`, tema, aviso, scrollbar. Corpo 12 pt/1,5; células padding 6 px (fiscalização 5 px). Gerar agenda paginarPreview por frame e avisa sucesso antes; algoritmo move nós inteiros, sem dividir tabela/lista.

PDF: `Portaria_Planejamento_<numero ou XX>-2026.pdf`. DOCX: `Portaria_Planejamento_5<numero ou XX>-2026.docx`, com `5` literal adicional confirmado. Número sem sanitização própria. Word tem CSS genérico, sem paginação a4-page.

Tema: `sistema_portarias_modo_escuro`; número: `sistema_portarias_ultimo_numero`. Número não vazio salvo ao gerar, não por digitação; apagar não remove último salvo. Zoom comum sem resize; aplica estilos compartilhados.

Riscos: tabela extensa indivisível, HTML/aspas interpoladas, nome DOCX discrepante, função livre de membros, labels sem associação, três colunas função/SIAPE/setor no celular e X pequeno sem área mínima. Preview mantém padding 2 rem no celular, diferentemente dos demais.

## CSS compartilhado, duplicações e portal

styles.css compartilha tokens --app-*, header, campos/foco, membros, toolbar, aviso e tema. Depende de utilitários Tailwind e estrutura HTML. `section:first-of-type`, `header > div:last-child` e `button:nth-of-type(1/2)` dependem da ordem: mover botões altera cores; inserir seções pode mudar alvo das regras.

Há muitos !important. CSS compartilhado vem antes do style local em pagamentos/ofícios e depois nas portarias. Tema/aviso estão duplicados nas portarias e no arquivo comum. Pagamentos/ofícios não têm as mesmas regras locais de cor de labels no tema escuro que as portarias: contraste precisa de verificação.

| Duplicação | Onde / ressalva |
| --- | --- |
| A4, wrapper, pdf-export, scrollbar | Quatro geradores; scrollbar também no portal. Tipografia/espaçamentos diferem. |
| Zoom, PDF, conversão de imagens/Word | Quatro geradores; nomes, HTML Word e edição do contêiner variam. |
| Paginação por nós | Pagamentos e portarias; ausente em ofícios. |
| Meses, datas, avisos, tema | Quatro scripts, com diferenças de persistência/timers. |
| Máscara de processo/S/N | Pagamentos/fiscalização; SICAF tem S/N sem máscara; planejamento só referência opcional. |
| Numeração local | Ofícios/portarias; chaves e momentos de gravação diferentes. |
| Cabeçalhos/assinaturas, header/toolbar da interface | Templates repetidos; sem componente JS compartilhado. Conteúdo oficial específico de cada modelo. |

Portal tem CSS próprio com tokens --navy/--blue, Georgia/Segoe UI, cards em duas colunas e breakpoint max-width 700 px para uma coluna. Esconde header-label no celular, usa max-width fluido, sem bloquear altura de viewport. Importa styles.css mas não usa app-page nem o header operacional dos geradores. Há sombras/movimentos em hover e não há regra prefers-reduced-motion. Não tem formulário, preview ou larguras fixas de formulário a analisar.

## Responsividade, mobile e acessibilidade — achados estáticos

- Quatro geradores: body h-screen/overflow-hidden, main overflow-hidden, rolagem interna e preview limitado por calc(100vh - 4rem). Header expandido/teclado virtual podem reduzir ou esconder áreas; falta estratégia de altura/rolagem específica. Ocorrência visual precisa de medição.
- Main empilha colunas e passa a md:flex-row com painéis 1/3 e 2/3. Sem mínimo confortável para formulário: em 768 px, proporção nominal de 1/3 é 256 px antes do padding.
- Grades grid-cols-2 permanecem no celular nos quatro; planejamento tem grid-cols-3 nos membros. Toolbar flex sem quebra, texto longo e tema junto ao zoom.
- Não há formulário com largura fixa de 550 px; inputs usam w-full. A largura fixa 210 mm é do documento. Em 50%, folha ainda tem ~397 px visuais, excedendo 320–390 px antes do padding. Não há ajuste à largura.
- Centralização flex, wrapper sem encolhimento e transform com origem central podem deixar bordas fora da área acessível. Overflow hidden nos ancestrais pode mascarar overflow horizontal como recorte; distinguir em navegador.
- Header/toolbar têm min-height 32 px, abaixo da referência 44 px; CTA com padding pequeno e X de planejamento sem área mínima. Inputs text-sm, membros py-1. Não há inputmode; valores/CNPJ/SIAPE/números textuais não solicitam teclado decimal/numérico.
- Ofícios tem labels estáticos associados; pagamentos/portarias têm vários sem for. Fiscalização usa apenas placeholders nos membros/alterações. Não há aria-invalid/describedby ou erro por campo; zoom simbólico sem aria-label (planejamento tem title).
- Downloads estão no header antes do formulário; tema na toolbar. Portal não tem tema; preferências não são globais entre páginas.

## Riscos prioritários para mudanças futuras

1. Integridade documental: ofícios com folha única/assinatura absoluta; demais com nós indivisíveis sujeitos a corte. Paginadores não repetem cabeçalho/tabela nem reservam separadamente a margem inferior: medem overflow da caixa inteira. Não aguardam explicitamente imagens ou repaginam após edição.
2. Exportação: CSS/página DOCX diferentes; PDF sem restauração garantida em erro; downloads concorrentes; nomes podem divergir da prévia.
3. Entrada/estado: perda de membros na fiscalização; HTML sem escape em pagamentos/portarias; máscaras não validam; valores livres. localStorage direto, sem tratamento de indisponibilidade, pode interromper inicialização/geração.
4. Datas/conteúdo: todos usam `new Date().toISOString().split("T")[0]` no onload: data UTC pode avançar a data local à noite em Manaus. Ofícios/portarias têm 2026 literal em templates e/ou nomes. Conteúdo institucional não foi alterado.
5. Cascata/mobile: dependências remotas, CSS duplicado/seletores por posição, altura e overflow, sem ajuste à largura, campos estreitos e touch pequeno.

## Encaminhamento recomendado para a FASE 1 (não executado)

Definir em styles.css tokens e componentes de interface com escopo explícito, mobile first: campos em uma coluna, foco/erro, alvos de 44 px, header/ações com quebra de linha e padrões de feedback. Separar esse escopo de a4-page e do HTML de exportação; não aplicar resets tipográficos, margens/alturas globais aos documentos. Planejar migração da cascata por componente, preservando IDs/handlers até revisão específica e evitando seletores por posição dos botões.

Pagamentos será piloto apenas na fase prevista; considerar as necessidades dos outros geradores desde o design system. Ajuste à largura, extração de JS, correções funcionais e aplicação às páginas ficam para fases posteriores, com regressão de múltiplas páginas/PDF/DOCX.

AGENTS.md e roadmap concordam nas fases 0/1, mas divergem na ordem/numeração posterior; esta auditoria não resolve isso nem avança fases. A solicitação específica autorizou atualizar somente arquitetura/testes, apesar da orientação genérica do roadmap de não editar na FASE 0.

## FASE 1 — Base compartilhada implementada (16/09/2026)

`styles.css` agora contém um design system com adoção explícita: classes `proad-*` dentro de um contêiner `.proad-ui`. Nenhum HTML foi migrado nesta fase; a apresentação atual continua usando as regras anteriores. A seção da FASE 0 permanece como baseline histórico.

### Tokens e componentes disponíveis

| Grupo | Contrato |
| --- | --- |
| Cores | `--proad-brand` (#12304A), accent (#1F5F85), cta (#16803C), background (#F5F7FA), surface, text (#1F2937), text-muted (#64748B), border (#D9E2E8); cores próprias para borda de controles, foco e disabled. |
| Feedback | Pares de texto/fundo info, success, warning e error; danger para ação destrutiva. |
| Tipografia | `--proad-font`: Inter, Segoe UI, Arial, sans-serif; small 0,875 rem, base 1 rem, título 1,25 rem e line-height 1,5. Nenhuma fonte externa adicionada; Inter só é usada se disponível. |
| Geometria | Escala de espaços 0,25–2 rem; borda 1 px; radius 0,25/0,375 rem; sombras sutis de painel/toast; altura mínima de controles 44 px. |
| Containers | `proad-container` fluido (máximo 80 rem), `proad-panel`, `proad-stack`, `proad-field`, `proad-field-grid` e modificador `proad-field-grid--two`. |
| Texto | `proad-title`, `proad-label`, `proad-help`, `proad-error-message`. |
| Botões | `proad-button`, variantes `--primary` (CTA verde), `--secondary` (azul), `--danger`, `--quiet`, `--icon`. A base também serve para links de navegação. |
| Campos | `proad-input` para input/textarea, `proad-select`, `proad-check` para label e `proad-checkbox` para checkbox nativo. Inputs/selects têm largura 100% e fonte 1 rem (16 px com raiz padrão). |
| Estados | Hover somente em dispositivos que suportam hover; focus-visible, disabled/aria-disabled em botões, disabled em campos, readonly em inputs e aria-invalid=true. |
| Toolbar | `proad-toolbar` com quebra de linha, rótulo `proad-toolbar__label` e botões compartilhados. Não implementa zoom ou fullscreen. |
| Toast | `proad-toast-region`, `proad-toast` (info padrão), variantes `--success`, `--warning`, `--error`; conteúdo/título/mensagem `proad-toast__content`, `__title`, `__message`. Respeita hidden. |

A base mobile usa grupos/campos/ações empilhados e padding de 1 rem. A partir de 640 px, padding passa a 1,5 rem, a grade opcional pode ter duas colunas, ações podem ficar em linha e a região de toast vai para a direita. Não foi alterado o layout formulário/documento atual. `prefers-reduced-motion` remove as transições novas.

### Tema, acessibilidade e isolamento

O tema claro é padrão. `body.dark-mode .proad-ui` ou `.proad-ui.dark-mode` sobrescreve os tokens de superfície/texto/borda/foco/feedback e color-scheme. A FASE 1 fornece apenas CSS; não cria toggle, persistência global ou comportamento de toast/validação.

Na adoção, colocar `.proad-ui` somente em áreas de interface (header, formulário, ações, toolbar e notificações), nunca no body ou em ancestrais do conteúdo A4/exportável. Componentes exigem as classes base, além dos modificadores, e não devem ser colocados dentro das folhas. Não há novas regras de documento, paginação, transform ou PDF/DOCX.

Os seletores antigos de campos e de botões/links operacionais agora excluem as classes correspondentes `proad-input`, `proad-select` e `proad-button` usando `:where(:not(...))`. Isso evita que os antigos !important impeçam os estados novos, sem aumentar especificidade ou alterar declarações antigas. Nenhuma página atual contém essas classes. Na futura migração, revisar também utilitários Tailwind e CSS inline específico de cada página; evitar misturar variantes novas com classes de cor/padding antigas.

CSS não cria semântica: associar label por for/id, helper/erro por aria-describedby e definir aria-invalid quando houver validação. Usar disabled real para ações indisponíveis; aria-disabled em links apenas comunica estado, não bloqueia navegação. Label proad-check fornece área de toque; checkbox sozinho tem 20 px. Botões simbólicos precisam de aria-label. Toast precisa de texto de tipo (ex.: “Erro: ...”) e região com role=status/aria-live=polite; avisos urgentes devem ter semântica apropriada. A abertura/fechamento/anúncio será integrada em fase posterior.

### Verificação desta fase

Fixture temporária, fora do projeto, validada no Chrome headless em viewports reais de iframe de 320, 390, 768 e 1366 px: parser CSS, controles de 44 px, fonte de campo 16 px, disabled distinto, borda de erro, grade mobile/expandida, ausência de overflow da área de interface, tema escuro, foco e invariância de largura/altura/padding/fonte de uma folha A4 de referência. Transições foram desativadas na fixture para medir estados finais.

Verificação estática confirmou que as declarações antigas permanecem idênticas, com apenas exclusões de migração de especificidade zero. HTMLs, scripts, imagens e seletores/regras A4 permanecem inalterados. Isso limita o risco de regressão atual; não substitui testes completos de exportação após adoção em páginas. FASE 2 não iniciada.

## FASE 3 — Layout externo mobile first do piloto (16/09/2026)

Esta seção descreve o estado atual de `pagamentos.html`; as seções anteriores registram as respectivas fases históricas. O piloto já utilizava o formulário semântico, campos em coluna, validação, estados de geração/download, tema no header e componentes `proad-*` ao iniciar esta etapa.

- O body deixa de usar `h-screen`/`overflow-hidden` como base. A classe `proad-workspace` organiza formulário e visualização em uma coluna, com rolagem vertical da página e formulário antes do preview. `proad-form-section` e `proad-preview-section` têm largura mínima zero para o documento não ampliar a grade externa.
- A navegação do header ocupa uma linha própria nas telas pequenas, com Portal e Tema lado a lado. A partir de **640 px**, volta à largura do conteúdo, aproveitando o breakpoint existente do design system para espaçamentos e ações.
- A partir de **1024 px**, o layout usa `minmax(320px, 420px) minmax(0, 1fr)`: formulário à esquerda e visualização à direita. A altura acompanha `100dvh`, com fallback `100vh`, e os painéis passam a ter rolagem interna. Em 768 px o formulário permanece empilhado, evitando os 256 px da antiga proporção de um terço.
- O contêiner externo do preview tem mínimo de 18 rem nas telas menores e conserva sua rolagem local. Folhas, conteúdo, margens, fontes, paginação, JavaScript e exportações não foram alterados. `.proad-ui` continua fora da árvore exportável.

As novas regras ficam em `styles.css`, sob `.proad-generator`, adotado somente pelo piloto. Inputs de 16 px, controles de 44 px, mensagens, toolbar e downloads reutilizam o design system existente. Os outros geradores não foram migrados.

Limite desta etapa: a escala inicial continua em 100%, com os controles anteriores. A centralização/escala da folha em áreas estreitas ainda pode deixar bordas fora da área visível; ajuste à largura e comportamento avançado do preview permanecem para a FASE 4 do roadmap. A FASE 3 não modifica o documento para acomodá-lo à viewport.

## FASE 4 — Visualizador do piloto (16/09/2026)

Somente pagamentos adota o visualizador atualizado. A escala inicial usa a largura útil de `preview-viewport` (clientWidth menos padding e 1 px de tolerância), dividida pela largura real do documento, limitada a 100%. `ResizeObserver` acompanha contêiner e documento; atualizações são agrupadas por requestAnimationFrame. Ajustar à largura mantém esse modo automático; zoom manual e reset para 100% o desativam. Os botões alteram a escala em 10 pontos percentuais, entre 25% e 200% (mínimo adaptado se o espaço disponível exigir menos de 25%).

A transformação permanece apenas em preview-content, com origem top left. O wrapper reserva as dimensões escaladas e contém o overflow do layout não escalado; o viewport permite rolagem em ambas as direções, com centralização somente quando há espaço. Folhas A4, margens, template e paginador não mudam.

Fullscreen usa a API nativa, com alternativa de painel fixo dentro da aba quando indisponível/rejeitada. O botão permite sair; Escape fecha a alternativa. Mudanças de fullscreen recalculam o ajuste e atualizam o rótulo/aria-pressed. A toolbar quebra linhas mantendo menos/percentual/mais agrupados.

Exportadores permanecem inalterados: PDF remove transform durante a captura; atualizarZoom ignora o estado pdf-export para evitar que resize recoloque a escala durante a exportação. DOCX usa o innerHTML do clone, sem o estilo de transformação do contêiner. As exportações foram comparadas à versão anterior em escalas diferentes; não houve migração dos demais geradores.

## Aplicação do padrão em Ofícios (16/09/2026)

`oficios.html` adota as classes existentes de `styles.css`, sem alterações no CSS compartilhado ou nos demais geradores. O header usa o padrão institucional, com Portal e Tema; o formulário tem os fieldsets Identificação, Regularização SICAF e Conta Vinculada, CTA ao final e downloads secundários. Todos os campos originais e seus IDs permanecem. Mobile usa uma coluna e rolagem da página; desktop tem duas colunas a partir de 1024 px, conforme o piloto.

A montagem original passou a se chamar `montarDocumento()`, com corpo/template inalterados. `gerarDocumento()` acrescenta validação e estados da interface ao redor dessa montagem. A prévia automática ao abrir/trocar modelo permanece; os downloads só habilitam após geração pelo CTA com dados válidos e desabilitam quando o formulário muda. As folhas continuam editáveis; gerar novamente ou trocar modelo substitui a edição, como antes.

A validação verifica preenchimento dos campos ativos e validade nativa de e-mail/data, com mensagens, aria-invalid/aria-describedby e foco no primeiro erro. Campos do modelo inativo ficam desabilitados, sem perder seus valores. Processo SICAF permanece livre, sem máscara/formato obrigatório; S/N limpa/desabilita e dispensa validação do processo. CNPJ mantém o formatador original, sem validar dígitos verificadores; valor da Conta Vinculada permanece textual, sem conversão ou regra monetária nova. Número do ofício continua opcional, preservando placeholder e fallback Sem_Numero; a chave `sistema_oficios_ultimo_numero` e a gravação/remoção a cada input permanecem. Datas iniciais agora são locais, conforme AGENTS.md; ano institucional literal não mudou.

Toolbar incorpora ajuste à largura, zoom 25–200%, percentual/reset e fullscreen do padrão piloto. ResizeObserver recalcula o ajuste quando automático; transformação e dimensões reservadas afetam só a visualização. Tema continua sem persistência própria, mas agora atualiza rótulo e aria-pressed. Toasts têm tipos, fechamento, timer substituível e região aria-live.

Geração/downloads bloqueiam ações concorrentes, informam loading e restauram controles em finally. PDF apenas passa a retornar sua promise para esse controle; opções, nomes, captura e restauração originais permanecem. Conversão DOCX e seus estilos permanecem integralmente iguais. O wrapper bloqueia edição por inert durante o download, sem alterar o HTML exportado. CSS A4/local, assinatura fixa e regra de uma única folha foram preservados. Texto excessivo ainda pode cortar ou colidir com a assinatura; esta etapa não cria paginação nova nem altera a formatação Word.

## Aplicação do padrão em Fiscalização (16/09/2026)

Somente `portarias_fiscalizacao.html` foi migrado nesta etapa. Reutiliza `styles.css` sem modificá-lo: header institucional com Portal/Tema, formulário antes do preview no mobile, duas colunas a partir de 1024 px, controles de 44 px e campos de 16 px. Os grupos são Identificação, Dados da contratação, Alteração de portaria, Referências adicionais, Composição da equipe e Equipe de gestão e fiscalização. CTA ao final e downloads secundários permanecem dentro do painel do formulário.

Todos os campos estáticos, seus IDs, opções e máscaras foram preservados. `renderizarMembros()` mantém `data-campo`/`data-index`, papéis e listeners; `renderizarAlteracoes()` mantém `.alteracao-membro`, `data-campo` e funções. A apresentação dinâmica agora usa fieldsets, labels associados, IDs únicos e mensagens de erro, sem mudar a recriação dos dados ao trocar configurações. Permanecem as funções de Contrato nas alterações de Empenho e a reexibição de opções quando o tipo muda após a finalidade.

`gerarDocumento()` controla validação/loading e chama a montagem original, renomeada `montarDocumento()`. São obrigatórios data, tipo, finalidade, número do contrato/empenho, empresa e os nomes/SIAPEs da equipe. Nova portaria exige CNPJ, objeto e processo quando S/N não estiver marcado. Alteração exige portaria original e dados de substituição; CNPJ permanece obrigatório em Contrato porque é usado na tabela, mas processo/objeto não são obrigatórios nessa finalidade. Números da portaria e referências continuam opcionais. Não há nova regra de formato administrativo, dígito verificador ou SIAPE numérico obrigatório. A quantidade setorial conserva a normalização original de 1–10, inclusive entradas 0/11.

Erros têm texto, aria-invalid/aria-describedby e foco no primeiro campo. Campos opcionais de referências permanecem visíveis; os checkboxes continuam determinando o texto e os marcadores para valores vazios. S/N continua limpando/desabilitando somente o processo principal. Alterações do formulário exigem nova geração pelo CTA antes do download; edição direta das folhas continua exportável, sem repaginação automática. Prévia com placeholders ao abrir permanece, com ações bloqueadas durante sua montagem; downloads iniciais ficam desabilitados.

Templates, artigos, tabelas, assinatura, logos, CSS documental, margens de 25 mm, dimensões A4 e corpo de `paginar()` permanecem iguais. A montagem retorna uma promise, aguarda a decodificação dos logos e mede as folhas sem transformação visual; o mesmo paginador reaplica o zoom ao terminar. Isso elimina a corrida de dimensões dos logos na geração, sem dividir blocos ou alterar o algoritmo. Falhas de decodificação não impedem a medição. Conteúdo extenso e tabelas indivisíveis continuam sujeitos aos cortes anteriores.

Toolbar adota ajuste à largura, percentual/reset, zoom 25–200% e fullscreen nativo/alternativo, com ResizeObserver e escala somente visual. `.proad-ui` não é ancestral das folhas exportadas. PDF conserva opções/nomes/captura e apenas retorna sua promise; DOCX conserva integralmente conversão, HTML/CSS e nomes. O controlador de download usa inert durante a operação e restaura transformação, classe PDF, controles e contenteditable do contêiner em finally, inclusive após erro. Toasts têm tipos, fechamento e aria-live.

Tema e número conservam as chaves `sistema_fiscalizacao_modo_escuro` e `sistema_fiscalizacao_ultimo_numero`. Tema persiste; número só salva ao montar documento e somente se não vazio. Apagar/gerar não remove o último salvo; equipe não persiste. Datas iniciais são locais conforme AGENTS.md; o ano literal 2026 do conteúdo e dos arquivos permanece. Não houve migração de outros geradores nem extração geral de JavaScript.

## Aplicação do padrão em Planejamento (17/09/2026)

Somente `portarias_planejamento.html` foi migrado nesta etapa, reutilizando `styles.css` sem alterações. Header institucional com Portal/Tema, fieldsets Identificação, Contratação, Referências e Membros da equipe, CTA Gerar prévia e downloads secundários seguem o padrão validado. Formulário precede o preview; layout empilhado abaixo de 1024 px e duas colunas a partir desse limite. Campos usam fonte de 16 px e controles possuem área de toque mínima de 44 px.

Campos estáticos, IDs, opções e regras originais permanecem. Data, descrição, centro de custo e nome/função/SIAPE/setor dos membros são obrigatórios para gerar pelo CTA. Número, prazo e referências continuam opcionais. A validação não bloqueia a normalização original do prazo: `Math.max(1, parseInt(valor,10) || 30)`. Não foi criada máscara, regra de formato de SIAPE/processo, opção S/N ou restrição de Presidente. Referências permanecem visíveis; seus checkboxes determinam inclusão e marcadores no documento.

Os membros dinâmicos agora têm fieldsets, labels associados, IDs únicos, mensagens de erro e botões de remoção acessíveis. O primeiro membro continua sem remoção e com função editável; demais podem selecionar Presidente. `atualizarMembro()` mantém a atualização por change. Valores dos inputs são atribuídos por DOM após a renderização, preservando aspas ao adicionar/remover membros. A interpolação HTML original dos templates documentais permanece. Adicionar/remover direciona o foco a um campo remanescente ou recém-criado.

`gerarDocumento()` envolve a montagem original, renomeada `montarDocumento()`, com validação, foco no primeiro erro, aria-invalid/aria-describedby, loading e feedback. A prévia automática com placeholders ao abrir permanece; downloads só habilitam após geração válida pelo CTA e desabilitam quando o formulário muda. Durante operações, controles e ações dinâmicas ficam bloqueados; finally restaura o estado após sucesso ou erro. Toasts usam tipos, fechamento, timer substituível e aria-live. Folhas continuam editáveis; edição manual permanece exportável e é substituída ao gerar novamente.

Templates, artigos, tabela, assinatura, logos, CSS documental, A4 de 210 × 297 mm, margens de 25 mm e corpo de `paginarPreview()` foram preservados. A montagem aguarda a decodificação dos logos e pagina sem transformação visual, retornando uma promise; falhas de decodificação não impedem a medição. O algoritmo continua movendo blocos inteiros, sem dividir tabelas ou parágrafos extensos. Toolbar adota ajuste automático à largura, zoom 25–200%, percentual/reset e fullscreen nativo/alternativo; ResizeObserver recalcula o ajuste. A escala afeta somente a visualização.

PDF apenas passa a retornar a promise original; opções, captura, nomes e dimensões A4 não mudaram. Conversão DOCX, HTML/CSS e nomes permanecem integralmente iguais, inclusive o `5` adicional no nome. O controlador bloqueia edição com inert durante downloads e restaura transform, classe PDF, contenteditable e controles em finally. A abertura comparativa no Word 16 confirmou o padrão preexistente Letter de 612 × 792 pt, margem 72 pt, pois `htmlDocx.asBlob(html)` continua sem opções de página; não há equivalência de formato com o PDF A4.

Tema e número mantêm `sistema_portarias_modo_escuro` e `sistema_portarias_ultimo_numero`. Número não vazio só salva ao montar, não ao digitar; gerar vazio mantém o último salvo. Equipe não persiste. Data inicial agora usa componentes da data local conforme AGENTS.md; ano literal institucional permanece. Nenhum outro gerador foi alterado, nem houve extração geral de JavaScript.
