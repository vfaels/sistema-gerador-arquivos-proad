# Arquitetura do Sistema Gerador PROAD

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
