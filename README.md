# MEU FILTRO

### Plataforma GovTech de Monitoramento e Gestão de Dispensas de Licitação no Estado do Rio de Janeiro

---

## Visão Geral

**MEU FILTRO** é uma plataforma SaaS (Software como Serviço) desenvolvida para automatizar o monitoramento, captura e gestão de oportunidades de compras públicas no modalidade **Dispensa de Licitação Eletrônica** (Lei 14.133/2021) no Estado do Rio de Janeiro. O sistema rastreia editais em tempo real nos principais portais de compras governamentais, filtra oportunidades por categorias de negócio (CNAEs) pré-cadastradas e fornece inteligência de mercado para maximizar a taxa de vitória em certames licitatórios.

### Público-Alvo

Empresas fornecedoras de bens e serviços ao setor público (microempresas, EPPs e empresas de médio porte) que atuam ou desejam atuar como fornecedoras de órgãos públicos no Estado do Rio de Janeiro.

---

## Perfil do Cliente Cadastrado

| Campo | Valor |
|---|---|
| **Responsável** | Bruna Matias de Almeida |
| **Empresa** | MATIAS MAGALHAES CONSTRUCOES LTDA |
| **CNPJ** | 60.921.451/0001-93 |
| **E-mail** | matiasmagalhaesengenharia@gmail.com |
| **Telefone / WhatsApp** | (21) 98675-9394 |

---

## Restrições Permanentes de Filtro

O sistema opera com um conjunto de filtros fixos que definem o escopo de monitoramento:

| Parâmetro | Valor |
|---|---|
| **Estado** | Rio de Janeiro (todos os 92 municípios) |
| **Modalidade** | Dispensa de Licitação Eletrônica |
| **Legislação** | Lei 14.133/2021 (Nova Lei de Licitações) |
| **Status Monitorados** | Aberto / Em Disputa |
| **Orçamento Máximo por Licitação** | R$ 100.000,00 |

---

## Ramos de Atuação — CNAEs Cadastrados

O sistema monitora 8 categorias de negócio (Classificação Nacional de Atividades Econômicas) cadastradas pela empresa:

| # | CNAE | Ramo de Atuação |
|---|---|---|
| 1 | 4761-0/03 | Papelaria e Escritório |
| 2 | 4754-7/01 | Móveis Corporativos |
| 3 | 4789-0/05 | Limpeza e Higiene |
| 4 | 4744-0/01 | Ferragens e Ferramentas |
| 5 | 4742-3/00 | Material Elétrico |
| 6 | 4744-0/03 | Material Hidráulico |
| 7 | 4741-5/00 | Construção Geral e Pintura |
| 8 | 4789-0/07 | Informática e Automação |

Cada CNAE pode ser ativado ou desativado individualmente na tela de Configuração, permitindo que a empresa ajuste o escopo de monitoramento conforme a estratégia comercial do momento.

---

## Portais Monitorados

O sistema realiza sincronização contínua com três portais governamentais:

| Portal | Descrição | Cor de Identificação |
|---|---|---|
| **PNCP** | Portal Nacional de Contratações Públicas — portal unificado federal | Azul |
| **Compras.gov.br** | Portal de Compras do Governo Federal | Verde |
| **SIGA-RJ** | Sistema Integrado de Gestão de Aquisições do Estado do Rio de Janeiro | Âmbar |

O status de sincronização é exibido em tempo real no cabeçalho do sistema, com indicadores visuais pulsantes para cada portal.

---

## Módulos do Sistema

### Módulo A — Configuração de Filtros e Perfil (CNAEs)

Página de configuração onde a empresa gerencia:

- **Perfil cadastrado:** Razão social, CNPJ, responsável, e-mail, telefone/WhatsApp e cargo.
- **Restrições permanentes de filtro:** Estado, modalidade, status e orçamento máximo.
- **CNAEs monitorados:** Lista dos 8 ramos com toggles de ativação/desativação individuais. Cada CNAE exibe seu código numérico e descrição.
- **Canais de alerta automatizado:** Configuração de notificações multicanal (ver seção Alertas Multicanal abaixo).

---

### Módulo B — Compras Urgentes (Fast Track Dashboard)

Feed em tempo real de Dispensas Eletrônicas ativas no Rio de Janeiro que correspondem aos CNAEs cadastrados. Funcionalidades:

- **Timer regressivo (countdown):** Cada card exibe um cronômetro ao vivo que mostra quanto tempo falta para o encerramento do edital (ex: "2h 45m" ou "45m 12s"). Cards com menos de 1 hora piscam em vermelho.
- **Ordenação:** Por mais urgentes, maior valor ou menor risco.
- **Filtro por portal:** PNCP, Compras.gov.br, SIGA-RJ ou todos.
- **Indicador de baixa concorrência:** Alerta visual verde quando um edital possui menos de 3 competidores identificados.

Cada card de oportunidade exibe:

| Elemento | Descrição |
|---|---|
| **Badge do Portal** | Identifica a origem (PNCP, Compras.gov.br ou SIGA-RJ) com cores distintas |
| **Badge de Risco** | Classificação automática: Baixo/Médio/Alto Risco com pontuação de 0 a 100 |
| **Timer Regressivo** | Tempo restante para encerramento, com animação de urgência |
| **Valor Estimado** | Valor total da licitação formatado em Real (R$) |
| **Órgão Comprador** | Nome do órgão público (ex: Câmara Municipal de Cantagalo, DETRAN-RJ) |
| **Município e Região** | Localização geográfica no estado do RJ |
| **Botão Ver Objeto** | Abre o painel de detalhamento (Módulo C) |
| **Botão Analisar Riscos** | Abre o painel de análise de riscos (Módulo C) |
| **Botão Enviar para Kanban** | Move o item para o funil de gestão (Módulo D) |

---

### Módulo C — Demonstrativo do Objeto e Análise Automatizada de Riscos

Painel deslizante (slide-over) que se abre ao clicar em um item, exibindo:

#### Demonstrativo do Objeto
- Descrição completa do objeto da licitação.
- Tabela detalhada de itens: produto, quantidade, unidade, preço unitário e total.
- Cálculo automático do valor total estimado.
- Endereço de entrega no Estado do Rio de Janeiro.

#### Análise Automatizada de Riscos do Edital (IA)

| Análise | Descrição |
|---|---|
| **Exclusividade ME/EPP** | Indicador verde (reservado para microempresas/EPPs — vantagem competitiva) ou vermelho (concorrência aberta a todos os portes) |
| **Complexidade de Habilitação** | Lista dos certificados obrigatórios: CNDT (Débitos Trabalhistas), CND Federal, CND Estadual, CND Municipal, Alvará de Funcionamento, NR-10, ISO 9001, entre outros |
| **Competidores Identificados** | Contagem de empresas concorrentes esperadas, com classificação de probabilidade de vitória |
| **Link Direto para o Portal** | Botão "Acessar Sala Pública no Portal" que abre a página do edital no portal de origem |

---

### Módulo D — Funil Kanban de Licitações

Quadro visual de gestão de licitações com 5 colunas (estágios do funil):

| # | Coluna | Descrição |
|---|---|---|
| 1 | **Triagem / Novas** | Itens recém-capturados pelo sistema, aguardando triagem |
| 2 | **Edital em Análise** | Itens em cálculo de margem e avaliação de riscos |
| 3 | **Proposta Cadastrada** | Propostas já submetidas no sistema governamental |
| 4 | **Em Disputa** | Sessão de disputa em andamento (ao vivo) |
| 5 | **Homologada / Encerrada** | Contratos vencidos ou perdidos |

Funcionalidades:

- **Arrastar e soltar (drag-and-drop):** Os cartões podem ser arrastados entre colunas livremente.
- **Botão de movimentação rápida:** Seta para avançar o item à próxima coluna.
- **Indicador ao vivo:** Cartões na coluna "Em Disputa" pulsam em vermelho com um indicador "AO VIVO".
- **Cada cartão exibe:** Portal de origem, título, órgão comprador, município, valor estimado e timer regressivo.
- **Clique no cartão:** Abre o painel de detalhes (Módulo C).

---

### Módulo E — Inteligência de Mercado e Analytics (BI Dashboard)

Dashboard de Business Intelligence com visualizações interativas:

#### KPIs (Indicadores-Chave de Performance)

| KPI | Descrição |
|---|---|
| **Valor Total Monitorado** | Soma do valor de todos os editais ativos |
| **Editais Ativos** | Quantidade de oportunidades em andamento |
| **Urgentes (< 4h)** | Editais que fecham em menos de 4 horas |
| **Baixa Concorrência** | Quantidade de editais com menos de 3 competidores |

#### Top Órgãos Compradores

Gráfico de barras horizontais mostrando quais órgãos públicos do Rio de Janeiro mais gastam nos CNAEs cadastrados, com valor total em BRL e número de contratos.

#### Distribuição por CNAE

Gráfico de rosca (donut chart) mostrando a distribuição de editais entre os 8 ramos cadastrados, com legenda colorida.

#### Distribuição de Valor por Região

Gráfico de barras mostrando o valor total de oportunidades por região do estado (Capital, Metropolitana, Serrana, Norte Fluminense, etc.).

#### Alerta de Baixa Participação

Painel que destaca regiões e órgãos que historicamente recebem menos de 3 licitantes, indicando oportunidades de alta probabilidade de vitória:

| Região | Licitantes Médios | Nível de Risco |
|---|---|---|
| Serrana | 1.8 | Alto |
| Norte Fluminense | 2.1 | Alto |
| Costa Verde | 2.4 | Médio |
| Baixada Litorânea | 2.7 | Médio |

#### Inteligência de Fornecedores B2B (Competidores Recorrentes)

Módulo de tracking de concorrentes que lista os 3 principais competidores recorrentes nas licitações do Rio de Janeiro, exibindo:

| Dado | Descrição |
|---|---|
| **Nome do competidor** | Razão social da empresa concorrente |
| **Vitórias** | Número de contratos vencidos |
| **Foco de CNAE** | Ramos em que o competidor mais atua |
| **Desconto médio** | Percentual médio de desconto oferecido em propostas |
| **Barra de progresso** | Comparação visual de vitórias entre competidores |

Este módulo permite que a empresa entenda o cenário competitivo B2B, identifique padrões de precificação dos concorrentes e ajuste sua estratégia de desconto para maximizar a competitividade das propostas.

---

## Alertas Multicanal

O sistema oferece notificações automatizadas em múltiplos canais:

| Canal | Descrição |
|---|---|
| **WhatsApp** | Notificações instantâneas enviadas via WhatsApp para o telefone cadastrado |
| **Telegram Bot** | Bot dedicado que envia alertas em tempo real |
| **Push do Navegador** | Notificações nativas do navegador (Web Push API) |
| **E-mail** | Resumo diário de novas oportunidades detectadas |

Botão "Testar Notificação" simula o recebimento de um novo edital, disparando um alerta no navegador e adicionando uma notificação ao painel.

---

## Portais de Origem dos Editais

Os editais monitorados são capturados automaticamente dos seguintes portais:

1. **PNCP** (Portal Nacional de Contratações Públicas) — `pncp.gov.br`
2. **Compras.gov.br** — Portal de Compras do Governo Federal
3. **SIGA-RJ** (Sistema Integrado de Gestão de Aquisições do RJ) — `siga.rj.gov.br`

Cada edital é identificado com um badge colorido indicando sua origem, permitindo filtragem e organização por portal.

---

## Características Técnicas

| Aspecto | Tecnologia |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite |
| **Estilização** | Tailwind CSS 3 com sistema de design tokens (CSS variables) |
| **Ícones** | Lucide React |
| **Gráficos** | Recharts (bar, pie, donut charts interativos) |
| **Tema** | Dark/Light mode com persistência em localStorage |
| **Responsividade** | Layout adaptável de mobile a desktop (breakpoints sm/md/lg/xl) |
| **Drag-and-Drop** | HTML5 Drag and Drop API nativa |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions) |

### Arquitetura de Componentes

```
src/
├── App.tsx                      # Componente raiz com roteamento de páginas
├── context/
│   └── ThemeContext.tsx         # Provider de tema dark/light
├── data/
│   └── mockData.ts              # Dados simulados (perfil, CNAEs, editais, concorrentes)
├── types/
│   └── index.ts                 # Tipos TypeScript do domínio
├── components/
│   ├── DetailModal.tsx          # Painel slide-over de detalhes (Módulo C)
│   ├── NotificationPanel.tsx   # Painel de notificações
│   ├── layout/
│   │   ├── Sidebar.tsx          # Navegação lateral
│   │   └── Header.tsx            # Cabeçalho com sync e perfil
│   └── ui/
│       ├── CountdownTimer.tsx   # Timer regressivo ao vivo
│       ├── PortalBadge.tsx      # Badge de portal de origem
│       ├── RiskBadge.tsx        # Badge de classificação de risco
│       └── Toggle.tsx           # Switch de ativação/desativação
└── pages/
    ├── DashboardPage.tsx        # Módulo E — Analytics e BI
    ├── KanbanPage.tsx           # Módulo D — Funil Kanban
    ├── UrgentPage.tsx           # Módulo B — Compras Urgentes
    └── SettingsPage.tsx         # Módulo A — Configuração e CNAEs
```

---

## Fluxo de Trabalho do Usuário

```
1. Configuração inicial
   └── Cadastrar perfil e ativar CNAEs de interesse (Módulo A)

2. Monitoramento automático
   └── Sistema captura editais dos portais PNCP, Compras.gov.br e SIGA-RJ
   └── Alertas enviados via WhatsApp, Telegram, Push ou E-mail

3. Triagem de oportunidades
   └── Visualizar Compras Urgentes com countdown (Módulo B)
   └── Filtrar por urgência, valor, risco ou portal

4. Análise de editais
   └── Abrir Demonstrativo do Objeto (Módulo C)
   └── Avaliar exclusividade ME/EPP, habilitação e competidores
   └── Acessar Sala Pública no Portal para ler o edital completo

5. Gestão no funil
   └── Enviar itens para o Kanban (Módulo D)
   └── Mover cartões: Triagem → Análise → Proposta → Disputa → Homologada

6. Inteligência de mercado
   └── Analisar BI Dashboard (Módulo E)
   └── Identificar órgãos que mais compram
   └── Detectar regiões de baixa concorrência
   └── Acompanhar competidores recorrentes e seus descontos médios
```

---

## Diferenciais Competitivos

1. **Monitoramento em tempo real** de 3 portais simultaneamente, cobrindo todos os 92 municípios do Rio de Janeiro.
2. **Filtragem por CNAE** que elimina ruído e mostra apenas oportunidades relevantes para o ramo de atuação da empresa.
3. **Análise de risco automatizada** que avalia exclusividade ME/EPP, complexidade de habilitação e nível de concorrência antes mesmo de o usuário abrir o edital.
4. **Timer regressivo ao vivo** que prioriza oportunidades por urgência, evitando perda de prazos.
5. **Inteligência B2B de competidores** que rastreia concorrentes recorrentes, suas vitórias e descontos médios praticados.
6. **Alerta de baixa concorrência** que identifica regiões e órgãos com menos de 3 licitantes, sinalizando oportunidades de alta probabilidade de vitória.
7. **Funil Kanban visual** que organiza o pipeline de licitações da triagem à homologação.
8. **Notificação multicanal** que garante que nenhuma oportunidade seja perdida, com alertas via WhatsApp, Telegram, Push e E-mail.

---

## Licença

Software proprietário. Todos os direitos reservados.

---

## Contato

**MATIAS MAGALHAES CONSTRUCOES LTDA**  
Responsável: Bruna Matias de Almeida  
E-mail: matiasmagalhaesengenharia@gmail.com  
Telefone/WhatsApp: (21) 98675-9394
