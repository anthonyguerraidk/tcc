# 📊 Relatório de Análise do Projeto

## 1. 🏗️ Identificação e visão geral

- **Nome do projeto:** Solar Cleaning Manager
- **Objetivo identificado:** Sistema de controle móvel para limpeza de painéis solares, inferido pela tela `Solar Cleaning Manager` e pelo subtítulo `Mobile Control System`.
- **Problema que o sistema pretende resolver:** Controle e monitoramento de um sistema de limpeza de painéis solares, com indicação de sensores, acionamento manual/automático e histórico de limpezas. O README não documenta formalmente esse problema.
- **Funcionalidades do MVP descritas:**
  - Dashboard com painéis limpos e uso de água.
  - Monitoramento de nível de poeira, tanque de água e status da bomba.
  - Botões de acionamento manual de limpeza, enxágue, escovação e parada.
  - Alternância de ativação automática baseada em sensores.
  - Registro visual de limpezas.
  - Observação: essas funcionalidades aparecem como interface/protótipo estático; o MVP não está descrito no README.
- **Tecnologias principais:**
  - Node.js
  - Express
  - HTML
  - CSS
  - JavaScript no navegador
- **Linguagens utilizadas:**
  - JavaScript
  - HTML
  - CSS
  - Markdown

### Evidências consultadas

- `readme.md` — contém apenas a frase “tcc project, nothing here for now”.
- `server.js` — importa Express, configura servidor na porta 3000, serve arquivos estáticos e define rotas `/`, `/data` e `/echo`.
- `public/index.html` — define a interface `Solar Cleaning Manager`, dashboard, sensores, controles, modo automático e log de limpeza.
- `public/style.css` — define estilos próprios para layout mobile, cards, botões, sensores, toggle e navegação inferior.
- `node_modules/.package-lock.json` — indica Express instalado na versão 5.2.1, mas não substitui a ausência de `package.json` do projeto.

---

## 2. 📂 Organização do repositório

```text
.
├── readme.md
├── server.js
├── public/
│   ├── index.html
│   └── style.css
└── node_modules/        (dependência gerada/instalada; ignorada na análise estrutural)
```

### Responsabilidade das pastas

- `public` — contém a interface estática servida pelo Express, com HTML e CSS.
- Raiz do projeto — contém o servidor Express (`server.js`) e o README.
- `node_modules` — dependências instaladas; não deveria ser considerada código-fonte próprio do projeto.

### Análise da organização

- Separação entre frontend e backend: **parcial**. Existe um arquivo `server.js` na raiz e uma pasta `public` para assets estáticos, mas não há estrutura clara de backend e frontend separados conforme a proposta da AV2.
- Nomes de pastas e arquivos: os nomes principais são simples e compreensíveis (`server.js`, `public/index.html`, `public/style.css`), mas a estrutura é mínima.
- Arquivos de configuração: **não identificados** no código próprio. Não há `package.json`, `.gitignore`, `.env.example`, configuração Prisma, Vite, React ou Tailwind.
- Organização mínima do projeto: existe uma organização básica para um protótipo Express com arquivos estáticos, mas insuficiente para um projeto com backend, frontend React, banco, Prisma e documentação inicial.

---

## 3. 📘 README e documentação inicial

**Localização:** `readme.md`

| Item esperado | Situação | Evidência |
|---|---|---|
| Nome do projeto | Não atende | `readme.md` informa apenas “tcc project, nothing here for now” |
| Problema que o sistema resolve | Não atende | Não há descrição do problema em `readme.md` |
| Objetivo do projeto | Não atende | Não há objetivo documentado em `readme.md` |
| Funcionalidades do MVP | Não atende | Não há lista de MVP em `readme.md` |
| Tecnologias utilizadas | Não atende | Não há tecnologias documentadas em `readme.md` |
| Instruções para execução local | Não atende | Não há comandos ou orientações de execução em `readme.md` |
| Divisão entre frontend, backend e banco | Não atende | Não há documentação de arquitetura em `readme.md` |

### Histórico de commits e participação

- Histórico disponível para análise: **Sim**
- Participação dos integrantes identificável: **Parcial**
- Evidências: o histórico local mostra 3 commits. Os autores aparecem como `anthony <anthony.guerra@eaportal.org>` em 2 commits e `anthony <anthony>` em 1 commit. Não há evidência de participação de outros integrantes pelo histórico disponível.

> Não foi atribuída autoria individual além do que aparece no histórico de commits.

### Professor como colaborador

**Situação:** NÃO VERIFICÁVEL PELO REPOSITÓRIO

---

## 4. ⚙️ Backend

- **Localização:** raiz do projeto (`server.js`)
- **Linguagem:** JavaScript
- **Framework principal:** Express
- **Arquivo de inicialização:** `server.js`
- **Servidor configurado:** Parcial. O servidor Express é configurado e inicia na porta 3000, mas não há manifesto do projeto (`package.json`) nem scripts de execução.

### Estrutura identificada

- `server.js` — cria a aplicação Express, serve arquivos estáticos de `public`, define rotas e inicia o servidor.
- `public/` — arquivos estáticos servidos pelo backend.

### Organização interna

- Rotas: presentes diretamente em `server.js`.
- Controllers: **NÃO IDENTIFICADO**.
- Services: **NÃO IDENTIFICADO**.
- Middlewares: apenas `express.static('public')` foi identificado.
- Configuração do banco: **NÃO IDENTIFICADO**.
- Validações: **NÃO IDENTIFICADO**.
- Tratamento de erros: **NÃO IDENTIFICADO**.

### Funcionalidades implementadas

- Servir arquivos estáticos da pasta `public` — Evidência: `server.js`.
- Rota `GET /data` que responde JSON fixo `{ status: 'ok' }` — Evidência: `server.js`.
- Rota `POST /echo` que responde JSON com `req.body` — Evidência: `server.js`.

### Fluxo das requisições

```text
GET /data → rota em server.js → resposta JSON fixa
POST /echo → rota em server.js → resposta JSON com req.body
```

O fluxo esperado `requisição → rota → controller/função → Prisma → banco de dados → resposta JSON` não está completo. Ele é interrompido logo após a rota/função em `server.js`, pois não há controller separado, Prisma Client, schema, migration ou banco de dados configurado.

Observação técnica comprovada: `POST /echo` usa `req.body`, mas não foi identificado middleware de parsing JSON no arquivo `server.js`.

---

## 5. 🗄️ Banco de dados e Prisma ORM

- **Tipo de banco:** NÃO IDENTIFICADO
- **ORM:** NÃO IDENTIFICADO
- **Configuração principal:** NÃO IDENTIFICADO
- **Schema Prisma:** NÃO IDENTIFICADO
- **Migrations:** Não
- **Localização das migrations:** NÃO IDENTIFICADO

### Models ou entidades identificadas

- NÃO IDENTIFICADO

### Modelagem

| Elemento | Situação | Evidência |
|---|---|---|
| Models principais definidos | Não atende | Não há pasta `prisma/`, `schema.prisma` ou outro arquivo de modelagem |
| Chaves primárias | Não atende | Não há schema de banco |
| Chaves estrangeiras e relações | Não atende | Não há schema de banco |
| Campos coerentes com o domínio | Não atende | Não há models/tabelas definidos |
| Prisma Client utilizado no backend | Não atende | `server.js` não importa nem instancia Prisma Client |
| Operação real de banco em rota/controller | Não atende | Rotas em `server.js` retornam dados fixos ou `req.body`, sem operação de banco |

### Operações Prisma encontradas

- `findMany`, `findUnique` ou equivalente: NÃO IDENTIFICADO
- `create`: NÃO IDENTIFICADO
- `update`: NÃO IDENTIFICADO
- `delete`: NÃO IDENTIFICADO
- Outras operações: NÃO IDENTIFICADO

### Banco no servidor de produção

**Situação:** NÃO VERIFICÁVEL PELO REPOSITÓRIO

Não foram identificados arquivos de configuração, migrations, schema, variáveis de ambiente exemplificadas ou qualquer evidência de criação de banco local ou em produção.

---

## 6. 🌐 Rotas da API e arquivo do Insomnia

### Rotas encontradas no backend

| Método | Endpoint | Arquivo | Operação realizada | Usa Prisma |
|---|---|---|---|---|
| GET | `/` | `server.js` | Tenta enviar arquivo HTML por `sendFile` | Não |
| GET | `/data` | `server.js` | Retorna JSON fixo com `status: ok` | Não |
| POST | `/echo` | `server.js` | Retorna JSON contendo `req.body` | Não |

### Adequação das rotas

- Uso adequado dos métodos HTTP: **parcial**. Há GET para leitura e POST para envio, mas as rotas são genéricas e sem persistência.
- Organização por funcionalidade: **não atende**. As rotas ficam diretamente em `server.js`, sem divisão por domínio.
- Clareza dos nomes: **parcial**. `/data` e `/echo` são nomes genéricos.
- Existência de parâmetros: **não identificado**.
- Recebimento de JSON: **parcial/não comprovado**. `POST /echo` usa `req.body`, mas não foi identificado `express.json()` ou equivalente.
- Respostas em JSON: **sim** para `/data` e `/echo`.
- Relação com funcionalidades essenciais do MVP: **parcial**. O comentário em `server.js` menciona ESP32 e envio de dados, mas as rotas ainda não implementam fluxo real de sensores, comandos, logs ou banco.

### Arquivo exportado do Insomnia

- **Arquivo encontrado:** NÃO IDENTIFICADO
- **Formato:** NÃO IDENTIFICADO
- **Rotas organizadas por funcionalidade:** Não
- **Nomes claros nas requisições:** Não
- **Exemplos de corpo JSON:** Não
- **Parâmetros e variáveis configurados:** Não
- **Compatibilidade com as rotas do backend:** Não

Não foi identificado arquivo exportado do Insomnia no repositório.

---

## 7. 🎨 Frontend

- **Localização:** `public/`
- **Framework:** NÃO IDENTIFICADO
- **Linguagem:** HTML, CSS e JavaScript no navegador
- **Ferramenta de criação/build:** NÃO IDENTIFICADO
- **Tailwind CSS:** Ausente
- **Roteamento:** NÃO IDENTIFICADO

### Arquivos principais

- `public/index.html` — estrutura da tela `Solar Cleaning Manager`, scripts de alerta e simulação de atualização de sensor.
- `public/style.css` — estilos da interface mobile, cards, botões, status, toggle e navegação inferior.

### Páginas e componentes

- `Dashboard` — apresenta valores fixos de painéis limpos e uso de água.
- `Sensor Monitoring` — apresenta nível de poeira, tanque de água e status da bomba; o nível de poeira muda de forma simulada no navegador.
- `Manual Cleaning` — apresenta botões de início/parada e modos de limpeza; início e parada exibem alertas.
- `Automatic Activation` — apresenta toggle visual marcado por padrão.
- `Cleaning Log` — apresenta registros estáticos de limpeza.
- `Bottom Navigation` — botões visuais de navegação sem roteamento funcional identificado.

### Análise do desenvolvimento inicial

| Elemento | Situação | Evidência |
|---|---|---|
| Projeto React iniciado | Não atende | Não há arquivos React, Vite, CRA, `src/`, JSX ou dependências React identificadas |
| Uso de JavaScript | Parcial | `public/index.html` contém funções `startCleaning`, `stopCleaning` e atualização simulada de sensor |
| Tailwind configurado ou utilizado | Não atende | Não há `tailwind.config`, classes Tailwind, PostCSS ou dependência correspondente |
| Telas principais iniciadas | Parcial | `public/index.html` possui uma tela estática com dashboard, sensores, controles e log |
| Componentes organizados | Não atende | A interface está concentrada em um único HTML, sem componentes React |
| Navegação entre páginas | Não atende | Botões inferiores são visuais, sem roteamento identificado |
| Tela conectada ou preparada para API | Não atende | Não há `fetch`, Axios ou chamada a rotas do backend no frontend |

O frontend atual é uma interface estática em HTML/CSS/JavaScript, não um projeto React com JavaScript e Tailwind.

---

## 8. 🔗 Conexão entre frontend e backend

- **Tipo de comunicação:** NÃO IDENTIFICADO para consumo do frontend; o backend expõe rotas REST simples.
- **Cliente HTTP:** NÃO IDENTIFICADO
- **Arquivo de configuração da API:** NÃO IDENTIFICADO
- **URL base:** NÃO IDENTIFICADO
- **Variáveis de ambiente:** NÃO IDENTIFICADO
- **CORS no backend:** Ausente
- **Proxy no frontend:** Ausente

### Endpoints consumidos pelo frontend

| Endpoint | Método | Componente ou página | Finalidade | Compatível com o backend |
|---|---|---|---|---|
| NÃO IDENTIFICADO | NÃO IDENTIFICADO | NÃO IDENTIFICADO | Não há consumo de API no frontend | NÃO IDENTIFICADO |

### Fluxos comprovados

- O backend serve arquivos estáticos da pasta `public`.
- Não foi identificado fluxo em que a tela busque dados de `/data`.
- Não foi identificado fluxo em que formulário ou botão envie dados para `/echo`.
- Os dados da interface são fixos ou simulados no próprio `public/index.html`.

### Estado da integração

**Classificação:** Não atende

Há um backend Express servindo a interface estática, mas não há comunicação comprovada de dados entre frontend e rotas da API. A integração de API é mencionada apenas indiretamente por comentários em `server.js`, sem uso real no frontend.

---

## 9. ✅ O que já está implementado

### Backend

- Servidor Express básico em `server.js`.
- Servimento de arquivos estáticos da pasta `public`.
- Rota `GET /data` com resposta JSON fixa.
- Rota `POST /echo` com resposta JSON baseada em `req.body`.

### Banco de dados

- NÃO IDENTIFICADO

### Frontend

- Tela estática mobile `Solar Cleaning Manager`.
- Layout visual com dashboard, monitoramento de sensores, controles manuais, ativação automática e log.
- Simulação local de alteração do nível de poeira via JavaScript no navegador.
- Estilos CSS próprios em `public/style.css`.

### Integração

- O backend serve o conteúdo estático da pasta `public`.
- Não há consumo de API pelo frontend.
- Não há integração com banco de dados.

---

## 10. 🚧 O que está incompleto ou em desenvolvimento

- README e documentação inicial
  - **Evidência:** `readme.md`
  - **Estado observado:** contém apenas uma frase genérica e não descreve nome, problema, objetivo, MVP, tecnologias, execução ou arquitetura.

- Estrutura formal de backend
  - **Evidência:** `server.js`
  - **Estado observado:** rotas e inicialização estão concentradas em um único arquivo; não há controllers, services, validações, tratamento de erro ou organização por módulos.

- Banco de dados
  - **Evidência:** ausência de arquivos `prisma/`, `schema.prisma`, migrations, SQL ou configuração de banco entre os arquivos próprios do repositório.
  - **Estado observado:** nenhum banco ou modelagem foi identificado.

- Prisma ORM
  - **Evidência:** `server.js` e listagem de arquivos próprios do projeto.
  - **Estado observado:** não há importação, configuração ou uso de Prisma Client.

- Rotas do MVP
  - **Evidência:** `server.js`
  - **Estado observado:** existem apenas rotas genéricas `/data` e `/echo`, sem persistência e sem modelagem ligada a sensores, comandos, limpezas ou logs.

- Export do Insomnia
  - **Evidência:** listagem de arquivos próprios do repositório.
  - **Estado observado:** não foi encontrado arquivo de coleção/exportação do Insomnia.

- Frontend React/Tailwind
  - **Evidência:** `public/index.html`, `public/style.css` e ausência de arquivos React/Tailwind.
  - **Estado observado:** há HTML/CSS estático com JavaScript embutido, sem React e sem Tailwind.

- Conexão frontend-backend
  - **Evidência:** `public/index.html` e `server.js`
  - **Estado observado:** o frontend não realiza chamadas HTTP para as rotas do backend.

- Integração com ESP32/hardware
  - **Evidência:** comentários em `server.js` e mensagem de commit “no connection to hardware (esp32) yet”.
  - **Estado observado:** integração mencionada como futura/não conectada.

---

## 11. 📦 Dependências principais

### Backend

| Dependência | Versão | Finalidade identificada |
|---|---:|---|
| `express` | 5.2.1 | Framework HTTP utilizado em `server.js` para servidor, rotas e arquivos estáticos |

Observação: não há `package.json` do projeto. A versão foi identificada em `node_modules/.package-lock.json` e `node_modules/express/package.json`, ambos pertencentes à pasta de dependências instaladas.

### Frontend

| Dependência | Versão | Finalidade identificada |
|---|---:|---|
| NÃO IDENTIFICADO | NÃO IDENTIFICADO | Não há dependências frontend declaradas no projeto |

Não foi possível diferenciar dependências de produção e desenvolvimento porque não há manifesto `package.json` do projeto.

---

## 12. 🧭 Arquitetura e padrões identificados

- **Arquitetura predominante:** estrutura simples de servidor Express com arquivos estáticos.
- **Separação de responsabilidades:** parcial e mínima. `server.js` concentra servidor e rotas; `public` concentra a tela estática.
- **Padrões identificados:** uso direto de rotas Express (`app.get`, `app.post`) e servir pasta pública com `express.static`.
- **Consistência entre os módulos:** a estrutura é consistente como protótipo estático, mas não corresponde à arquitetura esperada para frontend React, backend organizado, Prisma e banco de dados.

---

# 13. 📝 Avaliação conforme os critérios da AV2

## Regras de pontuação

A pontuação abaixo considera apenas evidências verificáveis no repositório. Itens dependentes de apresentação, acesso ao GitHub como colaborador, banco de produção ou demonstração externa foram marcados como não verificáveis quando aplicável.

## Quadro avaliativo

| Critério | Valor máximo | Nota atribuída | Evidências e justificativa |
|---|---:|---:|---|
| Organização do repositório, README e professor como colaborador | 1,5 | 0,3 | Há estrutura mínima com `server.js` e `public/`, mas o README não documenta o projeto e a colaboração do professor é NÃO VERIFICÁVEL PELO REPOSITÓRIO. |
| Banco de dados criado e coerente com o MVP | 2,0 | 0,0 | Não há schema, migrations, models, SQL, configuração de banco ou evidência de criação de banco. Banco de produção é NÃO VERIFICÁVEL PELO REPOSITÓRIO. |
| Arquivo exportado do Insomnia com as rotas organizadas | 1,5 | 0,0 | Nenhum arquivo exportado do Insomnia foi identificado. |
| Backend iniciado com integração ao banco usando Prisma ORM | 2,0 | 0,4 | Existe backend Express básico com rotas JSON, mas não há Prisma, banco, controllers ou operações reais de persistência. |
| Frontend iniciado em React, JavaScript e Tailwind | 1,5 | 0,4 | Há interface inicial em HTML/CSS/JavaScript, mas não há React nem Tailwind. |
| Conexão inicial entre frontend e backend | 1,0 | 0,2 | O backend serve a pasta `public`, mas o frontend não consome endpoints da API. |
| Clareza na apresentação e divisão de tarefas do grupo | 0,5 | NÃO VERIFICÁVEL | O histórico local mostra commits de um autor `anthony`, mas não há documentação de divisão de tarefas nem apresentação no repositório. |
| **Total verificável no repositório** | **10,0** | **1,3** | Soma dos itens verificáveis com base nas evidências disponíveis, sem converter o item de apresentação/divisão em zero automático. |

### Observação sobre o total

- **Pontuação obtida nos itens verificáveis:** 1,3
- **Pontos dependentes de apresentação ou verificação externa:** 0,5
- **Nota máxima que pode ser confirmada apenas pelo repositório:** 9,5

A colaboração do professor e a clareza na apresentação/divisão de tarefas dependem de verificação externa ou apresentação, pois não são comprováveis apenas pelos arquivos do repositório.

---

## 14. 📌 Síntese por critério

### 14.1 Organização do repositório e README — máximo 1,5

- **Situação:** Parcial
- **Evidências:** `readme.md`, `server.js`, `public/index.html`, `public/style.css`
- **Aspectos comprovados:** existe uma estrutura mínima com backend Express e pasta pública.
- **Aspectos ausentes:** README completo, `package.json`, `.gitignore`, documentação de execução, separação formal entre frontend/backend/banco.
- **Aspectos não verificáveis:** professor como colaborador.
- **Nota sugerida:** 0,3/1,5

### 14.2 Banco de dados e coerência com o MVP — máximo 2,0

- **Situação:** Não atende
- **Evidências:** ausência de `prisma/`, `schema.prisma`, migrations, SQL ou configuração de banco.
- **Models/tabelas principais:** NÃO IDENTIFICADO
- **Coerência com o MVP:** não verificável em modelagem, pois não há banco ou entidades.
- **Criação no servidor de produção:** Não verificável
- **Nota sugerida:** 0,0/2,0

### 14.3 Insomnia e organização das rotas — máximo 1,5

- **Situação:** Não atende
- **Evidências:** não foi encontrado arquivo de exportação do Insomnia.
- **Organização das requisições:** NÃO IDENTIFICADO
- **Compatibilidade com o backend:** NÃO IDENTIFICADO
- **Nota sugerida:** 0,0/1,5

### 14.4 Backend com Prisma ORM — máximo 2,0

- **Situação:** Parcial
- **Evidências:** `server.js`
- **Servidor Node.js/Express:** existe servidor Express com porta 3000 e rotas básicas.
- **Prisma configurado:** NÃO IDENTIFICADO
- **Operação no banco:** NÃO IDENTIFICADO
- **Resposta em JSON:** existe em `/data` e `/echo`.
- **Nota sugerida:** 0,4/2,0

### 14.5 Frontend com React, JavaScript e Tailwind — máximo 1,5

- **Situação:** Parcial
- **Evidências:** `public/index.html`, `public/style.css`
- **React iniciado:** NÃO IDENTIFICADO
- **JavaScript:** há JavaScript embutido no HTML para alertas e simulação de sensor.
- **Tailwind:** NÃO IDENTIFICADO
- **Telas e componentes:** há uma tela estática com seções visuais de dashboard, sensores, controles e logs.
- **Nota sugerida:** 0,4/1,5

### 14.6 Conexão frontend-backend — máximo 1,0

- **Situação:** Parcial baixa
- **Evidências:** `server.js`, `public/index.html`
- **Fluxo identificado:** o backend serve a interface estática.
- **Compatibilidade das rotas e dados:** não há consumo de `/data` ou `/echo` pelo frontend; dados da tela são fixos/simulados localmente.
- **Nota sugerida:** 0,2/1,0

### 14.7 Apresentação e divisão de tarefas — máximo 0,5

- **Situação:** Não verificável
- **Evidências no repositório:** histórico local com 3 commits atribuídos a `anthony`; não há documentação de divisão de tarefas.
- **O que precisa ser verificado na apresentação:** participação dos integrantes, divisão de tarefas, justificativa técnica das escolhas e demonstração do funcionamento.
- **Nota sugerida:** A DEFINIR/0,5

---

## 15. 🔍 Pontos para verificação durante a apresentação

- Verificar se a rota `GET /data` está sendo executada e qual dado real ela deveria representar no MVP.
- Verificar se a rota `POST /echo` recebe JSON corretamente e como ela se relaciona com comandos ou dados do ESP32.
- Verificar se existe banco de dados fora do repositório e se há modelagem definida para sensores, comandos, limpezas e logs.
- Verificar se o grupo possui schema Prisma, migrations ou configuração de banco ainda não versionados no repositório.
- Verificar se há arquivo exportado do Insomnia não incluído no repositório.
- Verificar se o frontend React/Tailwind foi desenvolvido em outro local ou ainda não foi iniciado.
- Verificar se a interface estática em `public/index.html` representa o MVP pretendido.
- Verificar se existe alguma integração real com ESP32/hardware, já que o commit mais recente indica que essa conexão ainda não existe.
- Verificar a divisão de tarefas entre integrantes, pois o histórico local mostra apenas commits atribuídos a `anthony`.
- Verificar a inclusão do professor como colaborador diretamente no GitHub, pois isso não é comprovável pelos arquivos locais.

---

## 16. 📋 Conclusão

O projeto está em nível inicial de protótipo. Há um servidor Express simples e uma tela estática mobile chamada `Solar Cleaning Manager`, com elementos visuais coerentes com monitoramento e controle de limpeza de painéis solares. O backend consegue servir arquivos estáticos e possui duas rotas JSON genéricas.

As partes comprovadamente funcionais pelo repositório são: estrutura mínima Express, pasta pública servida pelo backend, tela HTML/CSS e simulação local de sensor no navegador. As partes iniciadas, mas incompletas, são as rotas de API e a interface do MVP, pois ainda não há persistência, consumo de API pelo frontend ou integração real com hardware.

Não foram encontrados entregáveis centrais da AV2: README completo, `package.json`, Prisma ORM, schema, migrations, banco de dados, arquivo exportado do Insomnia, frontend React, Tailwind CSS e conexão de dados entre frontend e backend. A colaboração do professor, banco em produção, apresentação e divisão de tarefas são itens dependentes de verificação externa.

**Nota sugerida com base apenas nas evidências disponíveis:** 1,3/10,0, com 0,5 ponto de apresentação/divisão de tarefas marcado como **NÃO VERIFICÁVEL PELO REPOSITÓRIO** e a depender de avaliação presencial ou externa.
