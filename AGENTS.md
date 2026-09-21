# AGENTS.md

## Uso eficiente do agente

Este projeto deve ser desenvolvido incrementalmente.

Evitar analisar novamente todo o repositório quando a tarefa estiver limitada a um conjunto conhecido de arquivos.

Para cada tarefa:

1. identificar os arquivos diretamente envolvidos;
2. ler os arquivos necessários;
3. implementar somente o escopo solicitado;
4. não realizar refatorações não solicitadas;
5. não modificar arquivos sem relação com a tarefa;
6. utilizar a documentação existente como contexto;
7. evitar gerar explicações excessivamente longas quando um resumo das alterações for suficiente.

Para problemas complexos, primeiro investigar e identificar a causa antes de modificar código.

## Projeto

Sistema de Geração de Documentos da PROAD/UFRR.

O sistema é utilizado para geração e visualização de documentos administrativos, incluindo:

- Autorizações para pagamento
- Ofícios
- Portarias de fiscalização
- Portarias de planejamento

A aplicação atualmente utiliza:

- HTML
- CSS
- JavaScript
- Tailwind CSS via CDN
- html2pdf.js
- html-docx-js

O projeto NÃO utiliza React, Vue ou outro framework SPA.

---

## Objetivo atual

Modernizar a interface do sistema e melhorar sua usabilidade sem comprometer:

- geração dos documentos;
- exportação PDF;
- exportação DOCX;
- paginação A4;
- conteúdo oficial;
- regras administrativas;
- identidade institucional.

A prioridade é:

1. funcionamento;
2. integridade dos documentos;
3. UX;
4. acessibilidade;
5. estética.

Nunca priorizar aparência em detrimento da funcionalidade.

---

## Regra principal

Antes de modificar qualquer arquivo:

1. Leia o arquivo completo.
2. Identifique scripts relacionados.
3. Identifique IDs e classes utilizados pelo JavaScript.
4. Identifique regras CSS específicas do documento.
5. Identifique lógica de paginação.
6. Identifique lógica de exportação.
7. Faça a menor alteração possível.
8. Teste antes de continuar.

Não realizar grandes reescritas sem necessidade.

Quando uma alteração modificar a arquitetura ou o comportamento testável do sistema:

- atualizar `docs/ARQUITETURA.md` quando necessário;
- atualizar `docs/TESTES.md` quando novos fluxos ou funcionalidades forem adicionados.

---

# Regras Funcionais e Backlog

Existe um backlog funcional em:

`docs/BUGS_E_MELHORIAS.md`

Antes de corrigir ou implementar qualquer item desse arquivo:

1. confirmar o comportamento atual no código;
2. identificar todos os arquivos afetados;
3. procurar implementação equivalente já funcional;
4. reutilizar funções somente quando as regras forem realmente iguais;
5. implementar apenas o item solicitado;
6. atualizar `docs/TESTES.md`;
7. atualizar `docs/ARQUITETURA.md` se a estrutura do sistema mudar.

Não implementar automaticamente itens marcados como:

- Bloqueado;
- Necessita investigação;
- Necessita validação institucional.

---

# Escopo global

As regras deste projeto se aplicam a:

- `index.html`
- `pagamentos.html`
- `oficios.html`
- `portarias_fiscalizacao.html`
- `portarias_planejamento.html`

`pagamentos.html` pode ser utilizado como página piloto para UX/UI,
mas não é o único arquivo que deve receber as melhorias.

O resultado final deve ser consistente entre todos os geradores.

---

# Mobile First

Toda nova interface deve ser desenvolvida utilizando abordagem
mobile first.

A INTERFACE é responsiva.

O DOCUMENTO oficial NÃO é responsivo.

Os documentos continuam representando páginas A4.

Em telas pequenas, somente a escala de visualização deve ser adaptada.

Nunca reorganizar o conteúdo oficial do documento apenas para fazê-lo
parecer adequado ao celular.

---

# Entidades repetíveis

Quando uma informação puder ocorrer várias vezes, não criar estruturas
fixas como:

contrato1
contrato2
contrato3

Preferir coleções/arrays.

Exemplo conceitual:

contratos = [
  {
    numero,
    empresa,
    cnpj,
    equipe
  }
]

Não estabelecer limite artificial de contratos quando não houver
necessidade funcional.

---

# Contratos em Portarias de Fiscalização

Cada contrato é uma entidade própria.

Cada contrato deve poder possuir:

- número;
- empresa;
- CNPJ;
- equipe;
- alterações associadas.

Empresa e CNPJ NÃO são dados globais da portaria.

Eles pertencem ao respectivo contrato.

Um servidor pode possuir funções diferentes em contratos diferentes.

Cada contrato deve poder gerar sua própria tabela de composição.

---

# Art. 1º

A redação do Art. 1º deve ser gerada de acordo com os contratos
informados.

Com um contrato:
usar singular.

Com vários contratos:
usar plural.

Todos os contratos devem ser representados.

Empresa e CNPJ devem ser associados ao contrato correto.

Quando houver várias empresas/CNPJs, o texto deve incluir todas as
relações contrato → empresa → CNPJ.

Não concatenar informações de forma ambígua.

A redação deve continuar legível mesmo quando houver vários contratos.

---

# Portaria de alteração

Em alterações de Portaria de Fiscalização:

cada alteração deve estar associada a um contrato.

Uma alteração pode possuir:

- contrato;
- servidor novo;
- SIAPE;
- função;
- servidor substituído;
- tipo de alteração.

Os incisos devem ser gerados automaticamente:

I
II
III
IV
...

conforme a quantidade de alterações.

---

# Conteúdo oficial

A Portaria Fiscalização nº 508/2026 é referência estrutural para:

- múltiplos contratos;
- alterações relacionadas a contratos diferentes;
- composição independente por contrato;
- geração de múltiplas tabelas;
- documentos que ocupam várias páginas.

Ela NÃO apresenta empresa/CNPJ no Art. 1º.

A inclusão de empresa e CNPJ é uma nova regra funcional solicitada
para este sistema.

Não atribuir essa regra à Portaria 508.

## Consistência entre os geradores

Os diferentes geradores fazem parte do mesmo sistema.

O usuário não deve sentir que está entrando em aplicações diferentes ao navegar entre:

- Autorizações para pagamento;
- Ofícios;
- Portarias de fiscalização;
- Portarias de planejamento.

Todos devem compartilhar a mesma linguagem visual.

Isso inclui:

- mesmo header;
- mesmos botões;
- mesmos campos;
- mesmos estados de foco;
- mesmos estilos de erro;
- mesmos toasts;
- mesma área de ações;
- mesma toolbar de preview;
- mesmo comportamento responsivo;
- mesma identidade visual.

As particularidades de cada gerador devem existir somente onde forem funcionalmente necessárias.

Evitar duplicar estilos específicos quando um componente puder ser reutilizado.

---

## Arquivos principais

- `index.html`
- `pagamentos.html`
- `oficios.html`
- `portarias_fiscalizacao.html`
- `portarias_planejamento.html`
- `styles.css`

Arquivos de recursos:

- `assets/`
- `img/`

---

## Interface

Manter o modelo geral:

FORMULÁRIO | VISUALIZAÇÃO DO DOCUMENTO

Desktop deve utilizar duas colunas.

O formulário fica à esquerda.

A visualização A4 fica à direita.

Não transformar a aplicação em dashboard.

---

## Direção visual

A interface deve ser:

- institucional;
- moderna;
- limpa;
- simples;
- profissional;
- discreta;
- intuitiva.

Evitar:

- excesso de cards;
- gradientes;
- sombras fortes;
- excesso de cores;
- excesso de ícones;
- animações decorativas;
- aparência de SaaS genérico.

---

## Identidade visual

Preferir:

Azul principal:

`#12304A`

Azul secundário:

`#1F5F85`

Verde para CTA:

`#16803C`

Fundo:

`#F5F7FA`

Superfícies:

`#FFFFFF`

Texto principal:

`#1F2937`

Texto secundário:

`#64748B`

Borda:

`#D9E2E8`

---

## Tipografia

A interface pode usar:

```css
font-family:
  Inter,
  "Segoe UI",
  Arial,
  sans-serif;
```
Não alterar a tipografia dos documentos oficiais sem solicitação.

---

## Formulários

Agrupar os formulários semanticamente.

Exemplo:

- Identificação
- Processo eletrônico
- Sem número de processo
- Data
- Pagamento
- Tipo de pagamento
- Descrição
- Mês de referência
- Valor

Não criar containers pesados para cada grupo.

Usar principalmente:

- espaço;
- hierarquia tipográfica;
- títulos pequenos;
- bordas discretas.

---

## CTA

A ação principal é:

Gerar prévia

Ela deve ter maior destaque visual.

O fluxo esperado é:

Preencher
→ Gerar prévia
→ Revisar
→ Baixar

---

## Downloads

PDF e DOCX são ações secundárias.

Não remover essas funcionalidades.

Durante geração:

- desabilitar botão;
- informar estado de carregamento;
- restaurar botão ao finalizar;
- mostrar erro quando necessário.
- Paginação

A lógica de paginação dos documentos é CRÍTICA.

Não remover funções de paginação manual sem testes extensivos.

Mudanças em:

- padding;
- margin;
- font-size;
- line-height;
- height;

podem modificar as quebras de página.

Sempre testar documentos de múltiplas páginas.

---

## PDF

Preservar geração com html2pdf.js.

O PDF final deve:

- continuar em A4;
- preservar margens;
- preservar cabeçalhos;
- preservar logos;
- preservar assinaturas;
- não incluir controles da interface;
- não incluir toolbar;
- não incluir background do preview;
- não incluir zoom.

---

## DOCX

Preservar geração com html-docx-js.

Não substituir a biblioteca sem solicitação explícita.

Após mudanças relacionadas à exportação:

- gerar DOCX;
- abrir o arquivo;
- verificar conteúdo;
- verificar formatação.
- Preview

A área de preview pode possuir:

- diminuir zoom;
- aumentar zoom;
- 100%;
- ajustar à página;
- tela cheia.

Modo escuro deve ser um controle global, separado da toolbar do documento.

O documento A4 permanece branco mesmo no modo escuro.

---

## Estado da aplicação

Utilizar estados claros:

Inicial

Nenhuma prévia gerada.

Carregamento

Gerando prévia...

Sucesso

Prévia atualizada.

Erro

Não foi possível gerar a prévia.

---

## Toast

Preferir notificações não bloqueantes.

Tipos:

- success;
- error;
- warning;
- info.

Adicionar aria-live.

---

## Acessibilidade

Sempre considerar:

- <label> associado ao input;
- foco visível;
- navegação por teclado;
- aria-invalid;
- aria-describedby;
- contraste;
- mensagens de erro;
- <button> para ações;
- <a> para navegação.

Não depender somente de cor.

---

## Responsividade

Prioridade:

- Desktop
- Notebook
- Tablet
- Mobile

Desktop:

Formulário | Documento

Tablet/mobile:

Formulário
↓
Documento

Não apenas reduzir tudo proporcionalmente.

Reorganizar o layout.

---

# MOBILE FIRST

## Estratégia

Toda nova implementação de interface deve seguir abordagem mobile first.

Isso significa:

1. projetar primeiro para telas pequenas;
2. garantir que o formulário funcione corretamente no celular;
3. depois expandir o layout para tablet;
4. somente depois aplicar o layout desktop em duas colunas.

Não criar primeiro a interface desktop para depois apenas reduzir tamanhos.

A interface deve se reorganizar conforme o espaço disponível.

---

## Objetivo no celular

No mobile, a prioridade é o preenchimento do formulário.

O usuário deve conseguir:

- preencher todos os campos;
- navegar utilizando teclado;
- visualizar mensagens de erro;
- gerar a prévia;
- visualizar o documento;
- baixar PDF;
- baixar DOCX;
- utilizar zoom;
- acessar as principais ações;

sem zoom manual da página e sem rolagem horizontal da interface.

---

## Regra de largura

Nenhum componente da interface deve ultrapassar a largura da viewport.

Evitar larguras fixas na interface.

Não utilizar, por exemplo:

width: 550px;

para componentes de formulário.

Preferir:

width: 100%;
max-width: ...;

Larguras físicas fixas podem continuar sendo utilizadas internamente para representar a página A4.

A página A4 é uma exceção.

---

## Layout mobile

Em telas pequenas:

HEADER

DADOS DO DOCUMENTO

IDENTIFICAÇÃO

[ campos ]

PAGAMENTO / DADOS ESPECÍFICOS

[ campos ]

[ GERAR PRÉVIA ]

AÇÕES DO DOCUMENTO

[ PDF ] [ WORD ]

VISUALIZAÇÃO

[ toolbar ]

[ documento ]

O formulário aparece antes da visualização.

Nunca mostrar formulário e documento lado a lado em celulares.

---

## Layout tablet

Em tablets, avaliar o espaço disponível.

Preferencialmente:

FORMULÁRIO
────────────
DOCUMENTO

Em tablets grandes no modo paisagem, o layout lado a lado pode ser utilizado somente se houver espaço suficiente.

---

## Layout desktop

Em desktop:

FORMULÁRIO | VISUALIZAÇÃO

O painel de formulário deve ter largura confortável.

Sugestão:

minmax(320px, 420px)

para o formulário.

A área restante pode ser utilizada pelo visualizador.

---

## Breakpoints

Utilizar breakpoints de acordo com o conteúdo, não apenas com dispositivos específicos.

Referência inicial:

/* Mobile first */
@media (min-width: 640px) {
}

@media (min-width: 768px) {
}

@media (min-width: 1024px) {
}

@media (min-width: 1280px) {
}

Não é obrigatório utilizar exatamente esses valores se outro breakpoint resolver melhor o layout.

---

## Preview A4 no celular

A página A4 possui proporções físicas que não cabem naturalmente em telas pequenas.

No celular:

- manter a proporção A4;
- reduzir automaticamente a escala para caber na viewport;
- permitir zoom manual;
- não cortar conteúdo;
- não permitir que o documento empurre a interface horizontalmente.

A escala inicial deve ser calculada de acordo com a largura disponível.

Conceitualmente:

zoomInicial = larguraDisponivel / larguraDaPaginaA4;

Limitar o valor quando necessário.

---

## Ajustar à largura

Adicionar ao visualizador uma ação:

Ajustar à largura

Essa ação é especialmente importante no celular.

No mobile ela pode ser mais relevante que:

100%

A toolbar deve permitir:

- ajustar à largura;
- diminuir zoom;
- aumentar zoom;
- tela cheia.
- Toolbar mobile

No celular, a toolbar não deve ocupar espaço excessivo.

Evitar muitos botões com texto.

Pode utilizar:

[ ↔ ] [ − ] [ 75% ] [ + ] [ ⛶ ]

desde que:

- os botões tenham aria-label;
- o significado seja claro;
- os ícones sejam consistentes.

---

## Tamanho das áreas de toque

Botões e controles devem possuir área de toque confortável.

Preferir no mínimo aproximadamente:

min-height: 44px;

Não criar pequenos ícones difíceis de tocar.

---

## Formulários mobile

Inputs devem utilizar:

width: 100%;

e altura confortável.

Evitar campos lado a lado em telas pequenas.

Por exemplo, em desktop:

Processo          Data
[__________]      [__________]

No celular:

Processo
[________________]

Data
[________________]

---

## Tipos de input

Utilizar tipos adequados para melhorar o teclado virtual.

Exemplos:

Valor:

<input inputmode="decimal">

Data:

<input type="date">

Campos numéricos:

<input inputmode="numeric">

Isso melhora significativamente a experiência em dispositivos móveis.

---

## Evitar zoom automático do navegador

Inputs devem possuir tamanho de fonte adequado.

Preferir:

font-size: 16px;

em campos no mobile.

Isso reduz problemas de zoom automático em navegadores móveis.

---

## Header mobile

O header deve ser simplificado.

Desktop:

Sistema de Geração de Documentos
PROAD / UFRR

Portal | Tema

Mobile:

Sistema de Documentos

[ Menu ] [ Tema ]

Não tentar mostrar todas as ações horizontalmente no celular.

---

## Downloads mobile

PDF e DOCX devem continuar facilmente acessíveis.

Não colocar os dois como pequenos botões apertados junto de outras ações.

Exemplo:

Documento pronto

[ Baixar PDF ]

[ Baixar Word ]

ou duas ações lado a lado apenas quando houver largura suficiente.

---

## Navegação mobile

Se houver várias ações globais, considerar um menu simples.

Não implementar sidebar fixa em telas pequenas.

Não implementar menu complexo sem necessidade.

---

## Espaçamentos

No mobile, utilizar padding confortável.

Referência:

padding-inline: 16px;

Em telas maiores:

padding-inline: 24px;

ou equivalente.

---

## Conteúdo A4 versus interface

Existe uma separação obrigatória:

INTERFACE RESPONSIVA
≠
DOCUMENTO RESPONSIVO

A interface deve ser responsiva.

O documento NÃO deve ter seu conteúdo reestruturado para mobile.

O documento continua representando uma página A4.

No celular, somente sua escala visual deve mudar.

Nunca alterar o layout oficial do documento para fazê-lo parecer um documento mobile.

---

## JavaScript

Não mover todo JavaScript dos HTMLs de uma vez.

Extrair código compartilhado gradualmente.

Possível estrutura futura:

assets/js/
├── app.js
├── ui.js
├── preview.js
├── export.js
└── formatters.js

Extrair apenas funções realmente compartilhadas.

---

## CSS

Preferir estilos compartilhados em:

styles.css

Evitar aumentar ainda mais CSS inline nos HTMLs.

Estilos próprios do conteúdo do documento podem continuar localmente quando necessário.

---

## Dependências

Não remover sem avaliação:

- Tailwind CSS
- html2pdf.js
- html-docx-js

Não adicionar bibliotecas grandes sem necessidade.

---
 
## Datas

Utilizar data local do usuário.

Evitar depender de:

new Date().toISOString().split("T")[0]

quando a intenção for representar a data local.

---

## Moeda

Valores financeiros devem utilizar formato brasileiro.

Exemplo:

R$ 1.500,00

---

## Processo eletrônico

Preservar formato:

23129.123456/2025-01

Quando "Sem número de processo" estiver selecionado:

- desabilitar o campo;
- não validar o campo;
- utilizar S/N conforme a lógica atual.

---

## Conteúdo institucional

NÃO alterar automaticamente:

- textos oficiais;
- nomes de setores;
- destinatários;
- artigos;
- assinaturas;
- logos;
- nomenclaturas institucionais;
- regras administrativas.

Se uma mudança afetar o conteúdo oficial, interrompa e informe antes de modificar.

---

## Git

Antes de alterar:

git status

Depois de alterar:

git diff

Sempre informar:

- arquivos modificados;
- motivo;
- riscos;
- testes realizados.

Não criar alterações não relacionadas à tarefa solicitada.

---

## Estratégia de desenvolvimento

Implementar uma etapa por vez.

Não executar toda a modernização em uma única tarefa.

---

## Escopo da modernização

A modernização UX/UI se aplica a TODO o sistema.

Arquivos principais incluídos:

- `index.html`
- `pagamentos.html`
- `oficios.html`
- `portarias_fiscalizacao.html`
- `portarias_planejamento.html`

Todas as páginas devem, ao final da modernização, compartilhar:

- identidade visual;
- header;
- tipografia;
- sistema de cores;
- componentes de formulário;
- botões;
- feedbacks;
- toasts;
- estados de carregamento;
- padrões de validação;
- responsividade;
- acessibilidade;
- toolbar de visualização quando aplicável.

A página `pagamentos.html` deve ser utilizada apenas como página piloto.

O objetivo da página piloto é validar o padrão visual e a experiência antes de aplicar o mesmo padrão aos demais arquivos.

Depois que o padrão estiver estável, ele deve ser aplicado a:

1. `oficios.html`
2. `portarias_fiscalizacao.html`
3. `portarias_planejamento.html`
4. `index.html`, quando aplicável.

Não considerar a modernização concluída enquanto os demais geradores ainda estiverem utilizando o padrão antigo.

---

## Ordem das fases

Fase 0

Auditoria.

Fase 1

Design system.

Fase 2

Modernizar pagamentos.html.

Fase 3

Testes.

Fase 4

Aplicar padrão aos demais geradores.

Fase 5

Refatoração compartilhada.

Fase 6

Acessibilidade.

Fase 7

Responsividade e revisão final.

---

## Antes de finalizar uma tarefa

Verificar:

- Prévia funciona.
- PDF funciona.
- DOCX funciona.
- Zoom funciona.
- Formulário funciona.
- Conteúdo oficial não mudou.
- Não houve alteração acidental de paginação.
- Console não possui erros novos.
- Layout desktop continua utilizável.
- Git diff contém somente mudanças relacionadas à tarefa.

## Documentos de referência

Documentos institucionais utilizados como referência estão em:

`docs/referencias/`

Antes de modificar uma funcionalidade associada a um documento de
referência, ler o documento correspondente.

Os documentos de referência devem ser utilizados para entender:

- estrutura;
- organização;
- regras;
- paginação;
- relações entre entidades.

Não copiar automaticamente:

- nomes;
- SIAPEs;
- contratos;
- empresas;
- CNPJs;
- datas;
- números de portaria;
- dados específicos do documento de referência.

A Portaria Fiscalização nº 508/2026 é referência para a implementação
de múltiplos contratos em Portarias de Fiscalização.

Ela demonstra múltiplos contratos e composições independentes, mas não
define a nova regra de empresa/CNPJ no Art. 1º.

## Estratégia de manutenção

O sistema já possui diversas funcionalidades implementadas.

Antes de alterar qualquer item:

1. verificar se a funcionalidade já existe;
2. verificar se ela já está funcionando;
3. não reimplementar algo que já esteja correto;
4. corrigir somente o problema explicitamente solicitado;
5. não realizar redesign, refatoração ou reorganização não solicitada;
6. preservar implementações existentes que já atendem ao requisito.

Quando uma tarefa vier do backlog:

- localizar o problema;
- confirmar que ele ainda existe;
- corrigir somente o necessário;
- testar;
- finalizar.

Evitar reauditar todo o projeto em cada tarefa.