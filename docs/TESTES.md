# Plano de Testes — baseline da FASE 0

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
