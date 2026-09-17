# Plano de Testes — baseline da FASE 0

## FASE 8 — Acessibilidade global (17/09/2026)

Auditoria das cinco páginas, `styles.css`, `ui.js` e `preview.js`. Chrome via DevTools, HTTP local e baseline anterior à etapa; artefatos fora do repositório. Os registros históricos abaixo continuam identificados por fase, inclusive suas limitações e comportamentos posteriormente substituídos.

| Caso | Procedimento e resultado |
| --- | --- |
| A01 — Pular navegação | Nas cinco páginas: primeiro Tab revela o link de pular; Enter foca main; próximo Tab alcança o primeiro campo/card. Sem tabindex positivo. |
| A02 — Labels e descrições | Labels associados a todos os inputs, checkboxes, selects e textareas, inclusive membros e dez substituições de Fiscalização; IDs únicos e referências aria-describedby/labelledby existentes. Ajudas de prazo, número do ofício e quantidade setorial associadas. |
| A03 — Teclado | Tab/Shift+Tab percorrem os controles na ordem do DOM nas cinco páginas. Segmentos nativos de data/mês podem ocupar mais de um Tab no mesmo input. Cards do portal seguem Pagamentos → Ofícios → Fiscalização → Planejamento; Enter navega. Espaço alterna checkboxes e S/N; ArrowDown altera selects. |
| A04 — Erros | Submeter formulários vazios por teclado foca o primeiro erro. Árvore acessível do navegador confirma nome, descrição com mensagem e invalid=true. Corrigir/gerar limpa erros; required/disabled de grupos condicionais preservados. |
| A05 — Foco e carregamento | Geração por Enter restaura foco no CTA. Fechar notificação por Enter retorna ao controle anterior. Timer simulado não esconde toast com seu botão focado; fechamento explícito continua disponível. Navegação para outro controle não deve ser sobrescrita ao concluir uma operação. |
| A06 — Contraste e toque | Portal e geradores em 320/768/1366 px, incluindo Bolsa/Nota/S/N, SICAF/Conta, Contrato/Empenho/alteração e membros de Planejamento. Temas claro/escuro nos geradores: texto auditado ≥4,5:1, bordas ativas ≥3:1, alvos de interface ≥44 × 44 px (checkbox usa seu label). Sem overflow horizontal externo. Portal não possui tema. |
| A07 — Notificações | Árvore acessível confirma região permanente status com live=polite. Anúncio contém tipo/mensagem, separado do botão fechar. Estados e erros textuais não dependem somente de cor. |
| A08 — Preview | Zoom por Enter atualiza região status; percentual/reset e ajuste mantidos. Viewport rolável por teclado, foco branco sobre cinza; documento permanece branco. Link do memorando entra na ordem Tab e Enter dispara click (navegação externa interceptada apenas pelo teste), com foco visível. Trecho do link não editável somente na prévia; atributos originais restaurados no HTML Word. |
| A09 — Fullscreen | Nativo verificado na matriz de regressão; alternativa forçada por rejeição da API: elementos externos ficam inert, Tab/Shift+Tab permanecem no visualizador, Escape sai, restaura inert e foco. Botão de saída continua alcançável. |
| A10 — Tema | Espaço alterna Modo claro/escuro; foco visível também no tema escuro. Tema/fullscreen são botões de ação com rótulo variável, sem aria-pressed; ajuste à largura conserva toggle de rótulo fixo. Persistência original mantida. |

Resultados: 211 verificações de acessibilidade em 63 combinações de página/modelo/largura/tema; menor contraste textual medido na interface de 5,01:1. Sequência Tab/Shift+Tab completa em 131 controles das cinco páginas, mais ativação de checkboxes/selects e foco escuro. Cinco verificações adicionais confirmam Enter no link documental, foco sem roubo durante operação, retorno ao main quando não há controle anterior e preservação de inert preexistente. Console sem novos erros na matriz.

Regressão pertinente: 13 cenários/89 verificações nos quatro geradores. HTML documental comparado após retirar apenas atributos auxiliares da visualização; conteúdo, geometria e folhas iguais ao baseline. PDF/DOCX realmente baixados com zoom de 200%, comparados ao ajuste à largura anterior: nomes e imagens JPEG de todas as páginas PDF idênticos, MediaBox A4 e HTML Word igual. Todas as oito entradas ZIP dos DOCX idênticas nos 13 pares. Oito DOCX abertos no Word 16 (baseline/atual de Bolsa, SICAF, Contrato e Planejamento): texto, páginas, tabelas, imagens, dimensões e margem coincidem; formato Letter preexistente mantido. Comparação estática de 105 funções locais (com exceção das chamadas auxiliares intencionais) e todo CSS documental inline aprovada; parser JavaScript e git diff --check aprovados.

Pendências de validação humana: NVDA/VoiceOver (anúncios repetidos, ordem de leitura, erros e edição de folhas), Safari/iOS e aparelhos físicos. A árvore acessível e a emulação não certificam conformidade WCAG completa. Word verificado por automação, sem inspeção visual humana. Contraste institucional do cabeçalho documental `#777` e limitações de blocos longos foram preservados conforme a restrição de conteúdo/layout A4. Esta etapa não executa a FASE 9.

## FASE 7 — Regressão da extração compartilhada (17/09/2026)

Resultados desta etapa, sem substituir os registros históricos abaixo. Chrome via DevTools e servidor HTTP local; scripts, baseline e arquivos exportados em diretório temporário fora do repositório. A comparação usou logos decodificados nas duas versões para estabilizar medições; isso não modifica a lógica de carregamento da aplicação.

| Gerador | Cenários comparados antes/depois |
| --- | --- |
| Pagamentos | Bolsa, Nota Fiscal, S/N e descrição longa. |
| Ofícios | SICAF, Conta Vinculada e SICAF S/N. |
| Fiscalização | Contrato, Empenho com quatro membros, alteração com dez substituições e documento longo com 26 membros. |
| Planejamento | Equipe inicial de quatro membros e documento longo com 40 membros. |

Dados comuns: número 001, data 2026-09-16, processo 23129.123456/2025-01, CNPJ 12345678000190, SIAPE 1234567, valor 1.500,00, e-mail teste@example.com. Demais textos: `Dado de teste`; texto longo: `Texto institucional para testar a paginação. ` repetido 90 vezes. Portaria original na alteração: 500/2026.

- [x] Após cada extração (UI, preview, máscara e CSS): os quatro geradores verificados em 13 cenários e 89 verificações por rodada; HTML das prévias, quantidade de folhas e geometria documental iguais ao baseline.
- [x] Rodada final repetida após corrigir o comentário inicial da folha CSS extraída, com downloads novos: 13 cenários/89 verificações aprovados, console sem novos erros.
- [x] 320, 768 e 1366 px nos quatro geradores: ajuste à largura sem overflow horizontal da interface; zoom mínimo/máximo, reset 100%, fullscreen nativo e alternativa por rejeição da API, com saída por Escape. Proteção `.pdf-export` impede reaplicar zoom durante captura.
- [x] Estados iniciais, validação, mensagens, temas e persistência: Pagamentos continua sem prévia inicial; os demais continuam gerando ao abrir. Ofícios continua sem persistir tema. Folhas permanecem brancas.
- [x] PDF e DOCX efetivamente baixados nos 13 cenários finais em zoom de 200%, comparados ao baseline em ajuste à largura. Nomes, HTML Word e hashes das imagens JPEG de todas as páginas PDF idênticos; PDF A4 com MediaBox aproximado de 595,28 × 841,89 pt.
- [x] Pacotes DOCX abertos como ZIP: todas as oito entradas internas idênticas nos 13 pares, incluindo imagens, XML e HTML/MHT.
- [x] Word 16: oito DOCX abertos (baseline/atual de Bolsa, SICAF, Contrato e Planejamento). Texto integral, quantidade de páginas, tabelas, imagens, tamanho e margem iguais em cada par. Páginas no Word: 1/1/3/2, respectivamente; duas imagens por documento. Formato Letter 612 × 792 pt preservado, sem alegar equivalência ao PDF A4. A primeira tentativa COM ficou bloqueada pelo ambiente; a repetição fora do sandbox concluiu e encerrou a instância de teste.
- [x] 26 verificações adicionais: carregamento dos recursos por `file://` nos quatro geradores, scrollbar de 8 px, geração por HTTP, restauração de ações/estado após erros simulados de PDF/DOCX e substituição/cancelamento do timer de toast. Erro continua aberto após o prazo do aviso anterior. Formatadores carregados somente nas duas páginas que já tinham máscara.
- [x] Comparação estática: 108 funções específicas, DOM e CSS documental preservados; scripts passam no parser. Máscara e handler equivalentes em 54 entradas comparativas (parciais, pontuadas, excesso de dígitos, vazias e valores não textuais). `git diff --check` aprovado.

Limites: esta matriz cobre os componentes extraídos e os cenários acima, não uma nova execução integral de todos os roteiros históricos. Chrome emulado não substitui aparelhos reais/Safari ou leitores de tela. Abertura no Word foi automatizada, sem revisão visual humana; os outros nove pares foram comparados internamente. Permanecem os cortes de blocos indivisíveis, a folha única de Ofícios, o formato Letter do DOCX e o prefixo adicional no nome DOCX de Planejamento. Recursos locais novos precisam acompanhar os HTMLs na publicação. Nenhuma execução da FASE 8.

## Escopo e evidência (16/09/2026)

Casos derivados dos cinco HTMLs, styles.css e imagens locais. Seletores, fluxos e limitações estão em [ARQUITETURA.md](ARQUITETURA.md). Nenhuma melhoria implementada nesta fase.

Executado nesta auditoria: leitura integral dos fontes, inventário/inspeção das três imagens, análise sintática dos quatro scripts inline pelo parser do Node (`vm.Script`, sem executar o DOM), conferência estática dos IDs literais usados em getElementById e revisão do diff documental. Não foram encontrados IDs duplicados ou referências literais ausentes; isso não substitui testes dos seletores dinâmicos e eventos.

Os casos abaixo são roteiros pendentes em navegador/Word, não resultados aprovados. Não foram gerados/abertos PDF e DOCX nem medidos layout, console e touch em navegador nesta fase. Onde existe defeito/risco estático, registrar reprodução sem tratar o comportamento atual como requisito desejado.

## Preparação e registros

- Servir por HTTP; registrar navegador/versão, sistema, viewport, data/fuso, CDNs e armazenamento local. Testar file:// separadamente para a busca de imagens do Word.
- Usar dados fictícios: processo `23129.123456/2025-01`, empresa `Empresa de Teste`, valor `1.500,00`, número `001`, data `2026-09-16`, nomes/SIAPEs fictícios. Máscaras não verificam validade administrativa.
- Por fluxo: screenshot da prévia, quantidade de folhas, PDF/DOCX, nomes de downloads, console e diferenças. Abrir DOCX no Word e registrar versão; comparar também no editor utilizado pela equipe.
- Para texto extenso, repetir frase até ultrapassar folha; tabela extensa: 40 membros no planejamento e 10 fiscais setoriais na fiscalização. Registrar entrada exata que provoca corte.
- Usar perfil isolado para testar remoção/bloqueio de armazenamento, preservando dados reais.

## Navegação e estado comum

| ID | Procedimento | Comportamento atual / verificação |
| --- | --- | --- |
| G01 | Abrir portal, seguir quatro links, retornar por Portal inicial. | Links locais existem; confirmar navegação, estilos e favicon. Portal não tem tema/exportação. |
| G02 | Abrir geradores com armazenamento vazio. | Prévia automática com placeholders; não esperar estado inicial vazio. Pagamentos/portarias avisam sucesso; ofícios não avisa ao gerar. |
| G03 | Gerar, editar folha, baixar e gerar novamente. | Exportação usa folha editada; nova geração substitui edição. Não sincroniza formulário nem repagina edição. |
| G04 | Gerar número A, mudar campo para B sem gerar, baixar. | Detectar divergência nome/conteúdo; pagamentos tem nome DOCX fixo. |
| G05 | Gerar com campos vazios, processo incompleto, e-mail inválido e valor abc. | Registrar placeholders/textos aceitos; não presumir validação bloqueante. Não há submissão de form/checkValidity no fluxo. |
| G06 | Inserir texto inofensivo `A & B <b>TESTE</b>`; em planejamento testar aspas no nome e adicionar membro. | Ofícios escapa texto; pagamentos/portarias interpolam HTML. Registrar formatação/atributos indevidos sem usar scripts. |
| G07 | Simular 16/09/2026 às 21:30 em America/Manaus e recarregar. | Data vem de UTC e pode ser 17/09. Verificar documento e e-mail onde existe. Requisito futuro: data local. |
| G08 | Selecionar data de 2027 e gerar ofícios/portarias. | Registrar 2026 literal em cabeçalhos/nomes de portarias; não alterar conteúdo oficial nesta fase. |
| G09 | Bloquear localStorage em perfil de teste e abrir/gerar. | Sem tratamento local de exceções; observar interrupção/console. |

## Pagamentos — Bolsa e Nota Fiscal

- [ ] **P01 — Bolsa:** preencher processo/data, descrição, mês 2026-09 e valor 1.500,00. Conferir descrição, setembro de 2026, R$ 1.500,00, assinatura/logos; exportar PDF/DOCX.
- [ ] **P02 — Nota Fiscal:** após preencher Bolsa, selecionar Nota Fiscal: empresa aparece, descrição/mês desaparecem. Prévia anterior permanece até Gerar; depois não deve conter mês de bolsa. Exportar ambos.
- [ ] **P03 — S/N:** digitar processo, marcar S/N: desabilita e limpa. Gerar: documento S/N; PDF usa descrição/empresa sanitizada, sem S/N literal. Testar referência vazia (Sem_Identificacao), espaços e `/`. Desmarcar reabilita, sem recuperar valor anterior.
- [ ] **P04 — Máscara:** digitar 23129123456202501 → 23129.123456/2025-01; testar parcial/excesso sem confundir máscara com validação.
- [ ] **P05 — Moeda:** comparar 1.500,00, 1500.00 e R$ 1.500,00. Código concatena R$ ao texto; registrar falta de normalização/prefixo duplicado.
- [ ] **P06 — Conteúdo longo:** descrição/empresa extensa; observar quebras, assinatura e margem inferior. Parágrafo maior que folha não é dividido.
- [ ] **P07 — Word:** nome fixo Autorizacao_Pagamento.docx; comparar título/assinatura, sem estilos dessas classes no HTML Word.

## Ofícios — SICAF e Conta Vinculada

- [ ] **O01 — SICAF:** preencher número/data, empresa, CNPJ, e-mail/processo. Conferir destinatário, dados, logos e assinatura; PDF/DOCX.
- [ ] **O02 — S/N SICAF:** marcar/desmarcar, conferir limpeza/desabilitação e S/N após Gerar. Processo é livre, sem máscara.
- [ ] **O03 — Conta Vinculada:** alternar modelo; conferir geração automática/grupos visíveis. Preencher empresa/CNPJ, valor/evento, contrato, banco/agência/conta, data do e-mail/descrição. Conferir tabela e parágrafo nas três saídas. Não existe campo processo/S/N neste modelo.
- [ ] **O04 — CNPJ/datas:** testar 14 dígitos, parcial e formatado; máscara só quando obtém 14 dígitos, sem validação de dígitos verificadores. E-mail tem data por extenso.
- [ ] **O05 — Número:** digitar 001, sair sem Gerar, voltar: recuperar sistema_oficios_ultimo_numero. Apagar/sair/voltar: chave removida. Testar `/`, espaços e fallback Sem_Numero em downloads Oficio_sicaf/conta.
- [ ] **O06 — Limite da folha:** aumentar empresa/descrição nos dois modelos até exceder área útil; registrar corte/colisão com assinatura. Código sempre cria uma folha, sem paginação automática.
- [ ] **O07 — Tema/aviso:** alternar: folha branca, botão mantém Modo escuro, recarga não restaura tema. Disparar avisos próximos e verificar timer anterior escondendo novo; sem aria-live.
- [ ] **O08 — Word:** comparar logos, cabeçalho, tabela e assinatura; assinatura Word tem margem de 110 pt em vez de posição absoluta.

## Fiscalização — tipos, finalidade e equipes

- [ ] **F01 — Contrato novo:** dados/referências, equipe sem fiscal setorial; conferir seis membros, funções/notas e artigos nas três saídas.
- [ ] **F02 — Setoriais:** incluir 1/2/10, total 8/10/26 membros com substitutos. Digitar 0/11: getter limita a 1–10 se inclusão marcada. Registrar corte de tabela extensa.
- [ ] **F03 — Empenho:** 2/4 pessoas; conferir nomes/SIAPEs, cinco colunas, rowspan e blocos gestores/fiscais nas três saídas.
- [ ] **F04 — Perda de membros:** preencher e mudar tipo, quantidade setorial, inclusão setorial, quantidade de Empenho ou finalidade. renderizarMembros recria array/inputs vazios; registrar cada perda.
- [ ] **F05 — Alteração:** Contrato/Empenho, portaria original, 1/10 substituições; conferir maiúsculas, funções, I–X e artigos 4º/5º. Registrar funções de contrato também em Empenho e equipe/tabela mantidas.
- [ ] **F06 — Perda de alterações:** preencher designado/função/substituído, mudar quantidade ou voltar de nova para alteração: campos recriados vazios.
- [ ] **F07 — Ordem:** entrar em alteração e depois mudar Contrato/Empenho; registrar opções reexibidas, pois troca de tipo não consulta finalidade. Conferir campos CNPJ/processo/objeto visíveis, mas não usados no Art. 1º de alteração.
- [ ] **F08 — Referências:** cada checkbox, todos e nenhum. Inputs continuam visíveis; texto inclui apenas selecionados e placeholders para selecionados vazios.
- [ ] **F09 — Máscaras/S/N:** CNPJ, processo principal e referência; S/N limpa/desabilita só principal. Conferir texto na nova portaria; nome do arquivo depende do número da portaria, não processo.
- [ ] **F10 — Persistência:** sair após digitar sem Gerar não salva número; gerar e recarregar restaura sistema_fiscalizacao_ultimo_numero/indicador. Apagar/gerar não remove último salvo. Membros não persistem.
- [ ] **F11 — Conteúdo longo:** variar objeto/referências/equipe; conferir listas Art. 2º/3º, assinatura, link do memorando e margens. Tabelas/listas indivisíveis, sem repetição automática de cabeçalho.

## Planejamento — referências, prazo e membros

- [ ] **L01 — Inicial/completo:** quatro membros iniciais (Presidente + três Membros); preencher número/data, descrição, centro de custo/equipe, gerar/exportar.
- [ ] **L02 — Referências:** e-mail/processo/despacho/texto individualmente/combinados; nenhum e selecionados vazios. Inputs sempre visíveis; sem seleção aparece {REFERÊNCIA DO DOCUMENTO}. Não existe S/N específico ou máscara de processo.
- [ ] **L03 — Prazo:** vazio, 0, -1, 1, 30, 100, 999, 1000. Regra atual: vazio/0 → 30, negativo → 1, 100 → cem, acima de 999 → número como texto. Não presumir validação pelo atributo min.
- [ ] **L04 — Membros:** adicionar/remover/editar nome, função, SIAPE/setor. Primeiro não remove, mas pode mudar função; demais podem ser Presidente. Conferir maiúsculas e atualização ao perder foco (change).
- [ ] **L05 — Paginação:** 4/10/40 membros e descrição/referências longas; conferir artigos/lista/assinatura/margem inferior. Tabela não divide e pode ser cortada em nova folha.
- [ ] **L06 — Número:** sair sem gerar versus após gerar; somente geração salva sistema_portarias_ultimo_numero. Vazio não apaga último salvo; indicador acompanha salvo. Membros não persistem.
- [ ] **L07 — Nome:** número 001 gera Portaria_Planejamento_001-2026.pdf e Portaria_Planejamento_5001-2026.docx. Registrar 5 adicional como defeito. Testar caracteres problemáticos, sem sanitização própria.

## Exportação e paginação — matriz comum

Executar nos dois tipos de pagamentos, dois modelos de ofício, Contrato/Empenho novos e de alteração e planejamento. Conteúdo curto/extenso; exportar em 50%, 100%, 150% e nos dois temas.

| ID | Verificação / reprodução | Risco conhecido |
| --- | --- | --- |
| E01 | Abrir PDF: A4 retrato, logos, margens 25 mm, texto/assinatura, contagem de folhas e página extra vazia. | pdf-export remove gap/reduz altura 1 px; regra crítica. |
| E02 | Comparar PDF entre escalas/temas; sem toolbar/header da aplicação/fundo externo. | Exporta preview-content sem transform; sombra da folha não é removida explicitamente. |
| E03 | Baixar duas vezes e gerar durante exportação. | Sem bloqueio/carregamento; operações podem concorrer no DOM. |
| E04 | Bloquear biblioteca PDF/provocar rejeição; inspecionar preview/console. | Sem catch/finally; classe/transform podem não restaurar. |
| E05 | Bloquear biblioteca DOCX e clicar Word. | Deve avisar conversor indisponível. |
| E06 | Falhar fetch de logo/responder 404, exportar DOCX; testar file://. | Sem response.ok ou tratamento de fetch/FileReader/conversão. |
| E07 | Abrir DOCX no Word; comparar imagens, tabelas, bordas, fontes, assinatura, margens/páginas. | CSS reduzido, asBlob sem opções de página e sem quebras das folhas. Não declarar equivalência sem abrir. |
| E08 | Pagamentos/portarias: parágrafo/tabela/lista maior que folha; comparar scrollHeight/clientHeight e exportação. | Nós indivisíveis; não reserva margem inferior em contêiner de conteúdo separado. |
| E09 | Gerar com imagens carregando; depois editar folha com texto longo e exportar. | Não aguarda imagens nem repagina edição; aviso precede paginação agendada. |
| E10 | PDF portarias: inspecionar contenteditable antes/durante/depois. | Contêiner termina true embora inicie false; filhos continuam editáveis. |

## Mobile, responsividade, zoom e acessibilidade

Testar cinco páginas em 320, 360, 375, 390, 414, 480, 768, 1024, 1366 e 1920 px; paisagem, teclado virtual aberto e viewport baixa (ex.: 360 × 640). Incluir celular real quando possível.

- [ ] **M01 — Overflow:** medir documentElement.scrollWidth/clientWidth e área rolável do preview; conferir bordas, fim do formulário/documento. Ausência de scrollbar não prova ausência de corte por overflow hidden.
- [ ] **M02 — Altura:** header quebrando/teclado aberto; acessar todos os campos, Gerar, downloads e preview. Body h-screen/main overflow-hidden: registrar áreas inacessíveis.
- [ ] **M03 — Grades:** processo/data em pagamentos; campos duplos de ofícios; nome/SIAPE de fiscalização; função/SIAPE/setor de planejamento. Conferir estreitamento/date cortado. Não viram uma coluna no celular.
- [ ] **M04 — Breakpoint:** abaixo de md, formulário antes do preview; em 768/1024 avaliar 1/3 do formulário. Portal vira uma coluna até 700 px.
- [ ] **M05 — Zoom:** limites 50–150%, passos 10%, reset 100%, resize. Só ofícios tem resize; nenhum calcula fit-to-width. A4 em 50% ainda ocupa ~397 px antes do padding.
- [ ] **M06 — Toolbar:** texto/tema/zoom sem quebra flex; bordas acessíveis com zoom alto. Planejamento mantém 2 rem de padding no preview mobile, demais 1 rem até 768 px.
- [ ] **M07 — Touch/teclado:** medir alvos (header/toolbar mínimo 32 px), CTA/adicionar/remover/checks; Tab/Shift+Tab/Enter/Espaço e foco. Não presumir alvos 44 px.
- [ ] **M08 — Inputs:** fonte text-sm e possível zoom automático móvel; teclado de valor/CNPJ/SIAPE/processo sem inputmode. Datas type=date, mês de Bolsa type=month.
- [ ] **M09 — Leitor de tela:** labels sem for, campos dinâmicos só com placeholder em fiscalização, botões zoom, ordem DOM e avisos. Ofícios sem aria-live; demais status/polite. Sem erros com aria-invalid/describedby.
- [ ] **M10 — Tema:** persistência separada pagamentos/fiscalização/planejamento, sem persistência em ofícios. Folha branca e contraste de labels/placeholder/avisos, especialmente pagamentos/ofícios. Portal sem tema.
- [ ] **M11 — Portal:** cards por touch/teclado, cabeçalho/foco; registrar movimentos hover e ausência de regra para movimento reduzido, sem tratar hover como necessário à navegação.

Ajustar à largura, fullscreen, tema global compartilhado, carregamento e validação acessível por campo são requisitos futuros, não funcionalidades existentes. Não marcar como aprovados ou regressões desta versão.

## Encerramento e controle de mudanças

- [x] Fontes/recursos solicitados analisados, diferenças/riscos por gerador registrados.
- [x] Quatro scripts aceitos pelo parser e IDs literais conferidos estaticamente.
- [x] Recursos futuros separados do estado atual; testes manuais pendentes explicitados.
- [ ] Em futuras mudanças funcionais, executar matriz pertinente, abrir exportações e registrar resultados/console/limitações.

Estado inicial do Git: AGENTS.md e docs/ já não rastreados. Comparar arquitetura/testes também com cópias anteriores usando git diff --no-index; git diff comum não mostra arquivos não rastreados. Não adicionar ao índice apenas para relatar. Confirmar HTML/CSS/imagens inalterados e não avançar à FASE 1.

## FASE 1 — Verificação da base CSS (16/09/2026)

Os resultados abaixo são da fixture isolada do design system, não dos geradores migrados. Nenhuma página foi migrada nesta fase. Os roteiros da FASE 0 continuam relevantes para futura integração.

- [x] Chrome headless: viewports de iframe de 320, 390, 768 e 1366 px, sem overflow horizontal da área proad-ui da fixture.
- [x] CSS aceito pelo navegador; input e botão com altura mínima 44 px, input com fonte 16 px.
- [x] Grade de uma coluna abaixo de 640 px e duas colunas no modificador proad-field-grid--two a partir desse limite.
- [x] Disabled com aparência distinta, erro por aria-invalid, tema escuro por tokens e foco visível em botão.
- [x] Folha A4 de referência fora do escopo conserva largura, altura, padding e fonte ao mudar tema.
- [x] Comparação estática: declarações antigas idênticas; guardas de migração sem aumento de especificidade; classes novas ausentes dos cinco HTMLs atuais.

Os testes usaram uma fixture temporária fora do repositório, com transições desativadas para medir o estado final e toast em fluxo para a medição da área de interface. Não houve geração/abertura de novos arquivos PDF/DOCX nesta fase; funções/HTMLs de exportação não foram modificados.

Na futura adoção, executar também:

- [ ] Todas as variantes de botões/campos/checkboxes: hover, Tab/Shift+Tab, disabled, readonly e erro focado nos temas claro/escuro, com Tailwind e CSS local da página carregados.
- [ ] Toast fixo em todas as variantes, texto longo, hidden, botão fechar, leitor de tela e região aria-live; verificar área de toque e acesso ao formulário sob a notificação.
- [ ] Texto de erro além da cor, label/for, aria-describedby e bloqueio real por disabled; aria-disabled sozinho não impede ação em link.
- [ ] Preferência de movimento reduzido, zoom de texto, teclado móvel e contraste no tema escuro.
- [ ] Escopo proad-ui fora de body/folhas/ancestrais exportáveis; nenhuma regra de interface atingindo documento.
- [ ] Matriz da FASE 0 para prévia/zoom/paginação/PDF/DOCX e fluxos particulares antes de aprovar a migração de cada página.

Esta seção registra somente a FASE 1. A integração do piloto permanece para a FASE 2.

## FASE 3 — Layout externo de pagamentos (16/09/2026)

Testes no Chrome via protocolo DevTools, servido por HTTP local, com scripts temporários fora do repositório. Esta seção registra o piloto atual; não transforma os roteiros históricos dos demais geradores em testes aprovados.

**Larguras verificadas:** 320, 360, 375, 390, 414, 480, 768, 1024 e 1366 px, normalmente com altura de 800 px. Verificados também 320 × 568, 360 × 400 e 360 × 300, além dos limites 639/640 e 1023/1024 px. Viewports menores que 1024 foram emuladas como mobile.

- [x] 174 verificações automatizadas: overflow da interface, geometria, áreas de toque, fonte, acesso aos controles, ordem dos painéis, temas, Bolsa/Nota Fiscal, S/N, validação e restauração das ações após exportação.
- [x] `documentElement.scrollWidth` igual à largura da viewport nas nove larguras; nenhum elemento visível de `.proad-ui` ultrapassou as bordas horizontais. A rolagem do A4 permanece local ao preview.
- [x] Inputs/selects com fonte mínima de 16 px e altura mínima de 44 px. Botões, links operacionais e label clicável do checkbox com altura mínima de 44 px.
- [x] Formulário em uma coluna; abaixo de 1024 px, formulário completo e downloads antes do preview, com rolagem da página. Em 1024/1366 px, formulário de 420 px e painéis lado a lado.
- [x] Campos, CTA, downloads, zoom e tema alcançáveis por `scrollIntoView` e confirmados por hit testing no centro dos controles. CTA/downloads também acessíveis nas alturas reduzidas; submissão por Enter verificada separadamente.
- [x] Erro de campo vazio leva foco ao processo; campo e botão de fechar toast acessíveis em 320 × 568. Nota Fiscal oculta descrição/mês e habilita empresa; S/N continua desabilitando processo e aparece no documento.
- [x] Comparação com o HTML/CSS do HEAD anterior: prévias curta e longa mantiveram HTML, quantidade de folhas, largura, altura, padding, tipografia e alturas de conteúdo em todas as nove larguras. Caso longo: descrição `Atividades de ensino, pesquisa e apoio institucional. ` repetida 22 vezes, produzindo múltiplas páginas.
- [x] Downloads PDF e DOCX efetivamente gravados em 320 e 1366 px. PDF com MediaBox de aproximadamente 595,28 × 841,89 pt (A4), 309.589 bytes em ambos os tamanhos para a mesma Bolsa. Botões restaurados; zoom manual continua funcionando.
- [x] Capturas revisadas visualmente em 320 e 1366 px; console sem erros JavaScript e sem falhas de rede durante a matriz. `git diff --check` sem erros; script e CSS interno do documento preservados integralmente.

**Limitações:** emulação não substitui aparelho real, Safari/iOS ou teclado virtual real; alturas reduzidas simulam pouco espaço disponível. DOCX foi baixado, mas não reaberto no Word nesta fase de CSS externo. O preview ainda inicia em 100% e sua centralização pode deixar bordas fora da área visível em telas estreitas; escala automática e revisão desse comportamento ficam para a FASE 4. Não houve execução das fases seguintes nem migração dos outros geradores.

## FASE 4 — Preview, zoom e fullscreen (16/09/2026)

Chrome via DevTools, HTTP local e artefatos temporários fora do repositório. Matriz automatizada: 66 verificações, mais comparação multipágina e fullscreen em tablet/desktop.

- [x] 320, 360, 375, 390, 414, 480, 768, 1024 e 1366 px: ajuste inicial/automático cabe na largura útil, sem overflow horizontal da página.
- [x] Zoom mínimo 25%, máximo 200%, reset 100% e ajuste à largura; ambas as bordas da folha acessíveis pela rolagem no zoom manual. Percentual acompanha a escala.
- [x] Resize preserva zoom manual; modo automático recalcula a escala. Toolbar agrupa os três controles de zoom e quebra linhas.
- [x] Fullscreen nativo em mobile emulado, tablet e desktop; entrada/saída e alternativa por rejeição da API. Escape fecha o painel alternativo.
- [x] Comparação com HEAD anterior: HTML e geometria de folha curta iguais em todas as larguras; HTML/paginação do documento longo também iguais (descrição de teste da FASE 3).
- [x] PDF e DOCX baixados em ajuste à largura, 25% e 200%. Hash SHA-256 da imagem JPEG do PDF idêntico ao baseline em todas as escalas; HTML completo enviado ao conversor DOCX idêntico ao baseline, incluindo imagens incorporadas.
- [x] Console sem erros na matriz; captura mobile revisada; git diff --check.

Limitações: testes em Chrome emulado, sem aparelho físico/Safari; a alternativa de fullscreen ocupa a aba, sem ocultar controles do navegador. DOCX baixado e comparado na entrada do conversor, sem nova abertura no Word. Permanecem as limitações preexistentes de paginação de blocos indivisíveis e de fidelidade do CSS Word. FASE 5 não executada.

## Aplicação do padrão em Ofícios — resultados (16/09/2026)

Chrome via DevTools e HTTP local. Scripts/artefatos temporários fora do repositório; baseline copiado antes da alteração. Os roteiros O01–O08 acima continuam como referência histórica; o resultado atual está nesta tabela.

| Caso | Resultado atual |
| --- | --- |
| O01 — SICAF | Aprovado: processo 23129.123456/2025-01, número 001, data 2026-09-16, Empresa de Teste, CNPJ 12345678000190, empresa@exemplo.com. HTML, geometria da folha, imagem JPEG do PDF, nomes e HTML Word iguais ao baseline. |
| O02 — S/N | Aprovado: limpa/desabilita/dispensa validação; saída contém S/N. Desmarcar reabilita campo vazio. Processo livre preservado. PDF/DOCX de S/N comparados com baseline. |
| O03 — Conta Vinculada | Aprovado: troca mantém geração automática e exibe somente seus campos. Dados: valor 1.500,00, evento 123456, contrato 001/2026, banco 001, agência 1234-5, conta 12345-6, e-mail de 2026-09-15, descrição de liberação de obrigações contratuais. Tabela, parágrafo, PDF e entrada DOCX iguais ao baseline. Não foi criado processo/S/N neste modelo. |
| O04 — CNPJ/datas | Aprovado: 123 parcial, 12345678000190 e 12.345.678/0001-90; comportamento original do formatador preservado. Datas por extenso e dados do e-mail conferidos nas comparações. |
| O05 — Número | Aprovado: salvar 001 sem gerar/reabrir; apagar/reabrir remove chave. Nos dois modelos, ` 001 / A ` gera identificador 001_A; vazio mantém Sem_Numero em PDF/DOCX. |
| O06 — Folha longa | Limitação confirmada e preservada: frase `Texto extenso de teste institucional. ` repetida 100 vezes na empresa SICAF/descrição da Conta. HTML/geometria iguais ao baseline; uma folha, scrollHeight 1696/1741 px versus altura 1122,52 px, sujeito a corte/colisão com assinatura. |
| O07 — Tema/avisos | Aprovado para o padrão novo: folha branca, botão alterna Modo claro/escuro e aria-pressed; recarga continua sem persistir tema. Toast tem aria-live, tipos e substituição de timer; não esperar os defeitos históricos de rótulo/timer. |
| O08 — Word | Pacotes DOCX gerados e abertos como ZIP: hashes de todos os arquivos internos iguais ao baseline nos três casos, incluindo XML, HTML/MHT e imagens. Verificação visual no Word pendente: automação tentou abrir o baseline SICAF, mas não concluiu a abertura. Não declarar equivalência visual ao PDF. |

- [x] 146 verificações automatizadas da matriz, mais verificações de escape HTML, label/for, Enter, ausência/falha do conversor DOCX, restauração após erro de prévia e edição manual.
- [x] Ambos os modelos em 320, 360, 375, 390, 414, 480, 768, 1024 e 1366 px: sem overflow horizontal da interface; ajuste A4 dentro do viewport. Inputs/selects/textarea com fonte mínima 16 px; controles e label do checkbox com altura mínima 44 px. CTA/downloads/toolbar acessíveis por rolagem e hit testing.
- [x] Zoom mínimo/máximo, ajustar à largura e fullscreen nativo; loading, required, validação de e-mail, exclusão dos campos inativos e restauração de ações depois de rejeição PDF/DOCX. Console sem erros ou falhas de rede na matriz.
- [x] Comparação estática: CSS local/A4, corpo original de montagem (renomeado), cabeçalho/assinatura, formatador CNPJ, persistência/nomes e conversão DOCX idênticos. Parser JavaScript e git diff --check aprovados.

Limitações: emulação Chrome não substitui aparelhos reais/Safari, teclado virtual ou leitor de tela. Word não concluiu a abertura via automação; O08 visual permanece pendente. Folha única, assinatura fixa, ano literal e diferenças preexistentes do Word mantidos. Nenhum outro gerador ou styles.css foi modificado.

## Aplicação do padrão em Fiscalização — resultados (16/09/2026)

Chrome via DevTools e HTTP local; baseline copiado antes da alteração, scripts/artefatos fora do repositório. Comparação com logos decodificados nas duas versões: no baseline, o harness adiou apenas o frame de paginação até a decodificação. Sem essa estabilização, a corrida preexistente dos logos pode deslocar quebras. A implementação atual aguarda os logos antes de chamar o paginador original.

| Caso | Resultado atual |
| --- | --- |
| F01 — Contrato novo | Aprovado: sem setoriais, seis membros. Número 001, data 2026-09-16, contrato 001/2026, Empresa de Teste, CNPJ 12345678000190, processo 23129123456202501, objeto `prestação de serviços de teste`. Nomes `Servidor de Teste <índice>`, SIAPE 1234567. Artigos/funções/notas, HTML/geometria, PDF e DOCX iguais ao baseline estabilizado; duas folhas. |
| F02 — Setoriais | Aprovado: 1/2/10 resultam em 8/10/26 membros; 0/11 com inclusão marcada resultam em 8/26. PDF/DOCX comparados em todos esses casos. Corte preexistente confirmado: tabela de 26 membros produz folha com scrollHeight 1226 px versus clientHeight 1123 px; não foi corrigido nesta migração. |
| F03 — Empenho | Aprovado: 2/4 pessoas, cinco colunas, rowspan e funções originais. HTML/geometria, imagens de todas as páginas PDF e DOCX iguais ao baseline; duas folhas nos dois casos. |
| F04 — Recriação da equipe | Comportamento anterior confirmado e preservado: mudar tipo, inclusão/quantidade setorial, quantidade de Empenho ou finalidade apaga os inputs da equipe. Interface informa a recriação; não foi adicionada persistência dos membros. |
| F05 — Alteração | Aprovado: Contrato/Empenho com 1/10 substituições e portaria original 500/2026. Maiúsculas, I–X, funções e artigos 4º/5º iguais ao baseline em prévia, PDF e DOCX. Equipe/tabela continuam presentes e Empenho continua oferecendo funções de Contrato. Folhas: Contrato 2/4; Empenho 2/3. |
| F06 — Recriação das alterações | Comportamento anterior confirmado e preservado: mudar quantidade ou reabrir finalidade alteração recria designado/função/substituído. |
| F07 — Ordem das opções | Comportamento anterior confirmado e preservado: trocar tipo após entrar em alteração reexibe as opções daquele tipo. CNPJ/processo/objeto continuam visíveis; processo/objeto não são exigidos na alteração. CNPJ é exigido em Contrato por sua tabela, dispensado em alteração de Empenho. |
| F08 — Referências | Aprovado: cada checkbox, todos e nenhum; campos permanecem visíveis/opcionais. Valores vazios mantêm os marcadores selecionados; sem seleção permanece `{REFERÊNCIA DO DOCUMENTO}`. Dados completos: e-mail 2026-09-15, processo 23129123456202501, despacho 123/2026, `Referência de teste`. |
| F09 — Máscaras/S/N | Aprovado: máscaras originais de CNPJ e dos dois processos; S/N limpa/desabilita/dispensa validação somente do principal. Nova portaria contém `processo nº S/N`; desmarcar reabilita vazio. Downloads continuam dependendo do número da portaria. |
| F10 — Persistência | Aprovado: digitar 777 sem gerar não substitui 001 salvo; gerar 777/reabrir restaura chave/indicador. Apagar/gerar mantém 777 salvo. Equipe reabre vazia. Número continua opcional; tema continua persistindo em sua chave original. |
| F11 — Conteúdo longo | Comparação aprovada: objeto `Contratação de serviços institucionais. ` × 90, referência `Referência institucional de teste. ` × 60 e 26 membros. Cinco folhas iguais ao baseline estabilizado, incluindo listas Art. 2º/3º, assinatura e link do memorando; PDF/DOCX comparados. Cortes anteriores preservados: folhas com scrollHeight 1189/1226 px, blocos indivisíveis e sem repetição de cabeçalho. |

- [x] 148 verificações da matriz e 35 adicionais: CTA real, Enter em input, ordem Tab, loading/disabled, validação/foco, formulário sujo bloqueando downloads e recuperação após falhas de prévia/PDF/DOCX.
- [x] 320, 360, 375, 390, 414, 480, 768, 1024 e 1366 px: sem overflow horizontal da interface; ajuste A4 cabe no viewport. Inputs/selects/textarea com fonte mínima 16 px; botões e labels de checkboxes com área mínima de 44 px. CTA, downloads e toolbar alcançáveis por rolagem e hit testing.
- [x] Zoom 25–200%, reset/ajuste, fullscreen nativo em 320/768/1366 px, alternativa por rejeição da API e saída por Escape. Tema persistido, folha branca e aria-pressed; labels/IDs únicos e descrições de erros inclusive nos campos dinâmicos.
- [x] PDF/DOCX efetivamente baixados nos 13 cenários comparados. Hashes JPEG de todas as páginas PDF e nomes iguais ao baseline. DOCX abertos como ZIP: oito entradas internas por arquivo, com hashes idênticos ao baseline nos 13 casos, incluindo XML, MHT/HTML e imagens.
- [x] PDF/DOCX baixados também em 25%/200% no tema escuro. PDF com MediaBox aproximado de 595,28 × 841,89 pt (A4), imagens iguais ao baseline claro; zoom não altera exportação. Contêiner volta a contenteditable=false e folhas continuam editáveis após PDF; edição manual aparece no Word e é substituída ao gerar novamente.
- [x] Comparação estática: templates, CSS documental, corpo de paginação, definição de membros, máscaras/referências e conversão DOCX preservados. Parser JavaScript, git diff --check e console aprovados; capturas desktop/mobile revisadas.

Limitações: verificação visual do DOCX no Word pendente. A tentativa local de automação COM não respondeu às consultas necessárias para prosseguir com a abertura; apenas as instâncias criadas no teste foram encerradas. Não declarar equivalência visual com PDF. Emulação não substitui aparelhos reais/Safari, teclado virtual ou leitor de tela. Permanecem perda de dados ao recriar equipes/substituições, cortes em blocos extensos, interpolação HTML e ano institucional literal. Nenhum outro gerador ou styles.css foi modificado.

## Aplicação do padrão em Planejamento — resultados (17/09/2026)

Chrome via DevTools e HTTP local; baseline copiado antes da alteração e artefatos fora do repositório. Comparações com logos decodificados nas duas versões: o harness adiou somente o frame de paginação do baseline até a decodificação, estabilizando a corrida preexistente dos logos. A implementação atual aguarda os logos antes de executar o paginador original. Roteiros L01–L07 acima são históricos; os resultados atuais estão abaixo.

| Caso | Resultado atual |
| --- | --- |
| L01 — Inicial/completo | Aprovado: quatro membros iniciais, Presidente + três Membros; número 001, data 2026-09-16, descrição `aquisição de equipamentos de teste`, centro PROAD, prazo 30. Equipe `Servidor de Teste <índice>`, SIAPE 1234567, setor PROAD. HTML, geometria, duas folhas, PDF e DOCX iguais ao baseline estabilizado. |
| L02 — Referências | Aprovado: cada referência, todas, nenhuma e todas selecionadas vazias. Campos continuam visíveis/opcionais; sem seleção permanece `{REFERÊNCIA DO DOCUMENTO}`. Dados completos: e-mail 2026-09-15, processo 23129.123456/2025-01, despacho 123/2026 e `Referência de teste`. Não foi criado S/N ou máscara de processo. PDF/DOCX comparados. |
| L03 — Prazo | Aprovado em prévia/PDF/DOCX: vazio e 0 → 30; -1 → 1; 1, 30, 100, 999 e 1000 preservam a saída original, incluindo cem e número textual acima de 999. O atributo min não bloqueia essa normalização na validação do CTA. |
| L04 — Membros | Aprovado: adicionar/remover mantém dados e direciona foco; primeiro índice não remove, mas pode virar Membro; segundo pode virar Presidente. Nome em maiúsculas no documento, atualização por change preservada. Digitação real e Enter confirmaram atualização do membro antes da submissão. Aspas nos campos são preservadas na rerenderização do formulário. |
| L05 — Paginação | Comparação aprovada com 4/10/40 membros e conteúdo extenso. Equipe de 40 gera três folhas; caso longo com dez membros, descrição `aquisição de equipamentos para atendimento institucional. ` × 90 e referência `Referência institucional de teste. ` × 60 gera quatro. HTML, geometria e exportações iguais ao baseline estabilizado. Cortes preexistentes mantidos: tabela com scrollHeight 1739 px e bloco longo com 1669 px, contra clientHeight 1123 px; blocos não dividem nem repetem cabeçalho. |
| L06 — Número | Aprovado: digitar 777 sem gerar não substitui 001 salvo; gerar/reabrir restaura 777 e indicador. Apagar/gerar conserva 777 salvo; equipe reabre vazia. Chave `sistema_portarias_ultimo_numero` e gravação somente na montagem mantidas. |
| L07 — Nome | Aprovada preservação: 001 gera `Portaria_Planejamento_001-2026.pdf` e `Portaria_Planejamento_5001-2026.docx`; vazio mantém XX/5XX. Entrada `001 / A` comparada com baseline, sem nova sanitização própria. O `5` adicional continua sendo defeito preexistente. |

- [x] 174 verificações da matriz e 20 adicionais: CTA real, Enter, ordem Tab, loading/disabled inclusive em ações dinâmicas, validação/foco, formulário alterado bloqueando downloads e recuperação após falhas de prévia/PDF/DOCX.
- [x] 320, 360, 375, 390, 414, 480, 768, 1024 e 1366 px: sem overflow horizontal da interface; ajuste A4 cabe no viewport. Inputs/selects/textarea com fonte mínima 16 px; ações e labels de checkboxes com área mínima 44 px. Campos em coluna, formulário antes do preview no mobile; CTA, downloads e toolbar acessíveis por rolagem e hit testing.
- [x] Zoom 25–200%, reset/ajuste, fullscreen nativo em 320/768/1366 px, alternativa após rejeição da API e saída por Escape. Tema persistido, folha branca, aria-pressed; IDs únicos, labels e descrições de erro nos campos dinâmicos.
- [x] PDF/DOCX efetivamente baixados nos 20 cenários comparados. HTML/geometria/paginação e hashes JPEG de todas as páginas PDF iguais ao baseline estabilizado. HTML enviado ao Word e nomes iguais; pacotes DOCX abertos como ZIP, com hashes idênticos das oito entradas internas em todos os casos.
- [x] PDF/DOCX também baixados em 25%/200% no tema escuro. Imagens PDF iguais ao baseline no mesmo tema; MediaBox aproximado de 595,28 × 841,89 pt (A4), independente do zoom. Restauração do contêiner a contenteditable=false, folhas editáveis e ações dinâmicas habilitadas após exportação. Edição manual aparece no HTML Word e é substituída ao gerar novamente.
- [x] DOCX completo do baseline e da versão atual abertos no Word 16 em instância invisível de teste: conteúdo textual integral, duas páginas, duas tabelas e duas imagens idênticos. Formato nativo também idêntico: Letter 612 × 792 pt e margem 72 pt, preexistente; não declarar equivalência ao PDF A4. Somente a instância criada no teste foi encerrada.
- [x] Comparação estática: corpo original de montagem, CSS documental, paginação, referências, prazo, persistência e conversão DOCX preservados. Parser JavaScript e git diff --check aprovados; console sem erros novos ou falhas de rede não canceladas. Capturas de interface mobile/desktop revisadas.

Limitações: Chrome emulado não substitui aparelhos reais/Safari, teclado virtual ou leitor de tela. Word abriu o cenário completo comparativo; demais DOCX foram comparados por conteúdo interno, sem abertura individual no Word. Permanecem cortes em blocos extensos, interpolação HTML documental, ano literal, prefixo adicional no nome DOCX e formato Letter padrão do conversor. Nenhum outro gerador ou styles.css foi modificado; não houve avanço de fase.
