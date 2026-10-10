# Verzel Store — Automação de Testes E2E e API (Playwright)

Projeto de automação de testes funcionais (E2E) e de integração (API REST) desenvolvido com **Playwright** para a **Verzel Store**. A suíte cobre os critérios de aceite da User Story **Card VZS-142 (Versão 2.3.0) — Cupom de desconto e frete grátis**, além de testes de regressão e validação de contratos de API preexistentes.

---

## 📌 1. Mapeamento de Entregas do Projeto

Todos os artefatos gerados para a entrega do projeto estão organizados e disponíveis conforme o quadro abaixo:

| Entrega / Artefato |  Onde Encontrar | Descrição e Conteúdo |
| :--- | :--- | :--- | :--- |
| **Cenários de Testes** | `docs\PARTE1_ Suite_US-VZS-142_CuponsDescontoFreteGratis.pdf` e `docs\PARTE2_SuiteRegressaoContratoAPI.pdf` | Cenários de Testes criados |
| **Relatório POSTMAN (API)** | `docs\relatorio-api-verzel.html` | Relatório de testes de API realizados no POSTMAN |
| **Relatórios de Sessão** | `docs\relatorio_sessao_verzel_store.pdf` | Relatório de Sessão da Execução dos testes Exploratórios e de API  |

---

## 🏗️ 2. Estrutura do Projeto de Automação

O projeto foi estruturado em duas grandes suítes para permitir execuções direcionadas e pipelines independentes:

```text
playwright-tests-v2/
├── package.json                   # Dependências do projeto e scripts npm pré-configurados
├── playwright.config.js           # Configurações globais (baseURL, browsers, timeout e relatórios)
├── README.md                      # Guia completo de configuração e execução
└── tests/
    ├── vzs-142/                   # SUÍTE DA US VZS-142 (Cupons e Frete Grátis)
    │   ├── carrinho-api.spec.js   # CT-US-API-01 a 07 (Cálculos de frete, 10% cupom, tolerância e limite de 5 itens)
    │   ├── pedidos-api.spec.js    # CT-US-API-08 a 10 (Rejeição estrita 422 de cupom inválido/expirado e limite)
    │   └── carrinho-e2e.spec.js   # CT-US-01 a 10 (Fluxo visual de carrinho, alertas e frete grátis)
    └── regressao/                 # SUÍTE DE REGRESSÃO E CONTRATOS DE API
        ├── produtos-api.spec.js   # CT-REG-10 a 12 (Listagem geral GET 200 e consulta 404)
        ├── carrinho-contrato.spec.js # CT-REG-05 a 09 (Validação de payload: itens vazios, duplicados, incompletos)
        ├── pedidos-cadastro.spec.js  # CT-REG-01 a 04 (Máscara VZ-000000 e regras cadastrais de cliente)
        └── erros-roteamento.spec.js  # CT-REG-13 a 15 (Tratamento de exceções: JSON 400, rota 404 e método 405)
```

---

## ⚙️ 3. Pré-requisitos

Antes de iniciar, certifique-se de possuir instalado em sua máquina:
* **Node.js** versão 18 ou superior
* **npm** (gerenciador de pacotes incluso no Node.js)
* Acesso à aplicação web da Verzel Store (ambiente técnico configurado na Cloudflare)

---

## 🚀 4. Instalação Passo a Passo

1. **Descompacte o arquivo** `playwright-testes-verzel-store-v2.zip` ou acesse o repositório clonado.
2. Abra o terminal na pasta raiz do projeto (`playwright-tests-v2/`).
3. Instale as dependências do projeto:
   ```bash
   npm install
   ```
4. Instale os navegadores gerenciados pelo Playwright:
   ```bash
   npx playwright install chromium --with-deps
   ```

---

## 🧪 5. Como Executar os Testes

O projeto conta com comandos via `npm run` e via `npx playwright test`, além de suporte a tags de execução (`--grep`).

### 5.1. Execução Rápida via Atalhos NPM (`package.json`)

```bash
# Rodar todos os testes do projeto
npm test

# Rodar apenas a suíte da nova entrega (Card VZS-142)
npm run test:vzs-142

# Rodar apenas a suíte de regressão e contratos
npm run test:regressao

# Rodar apenas os testes de API
npm run test:api

# Rodar apenas os testes funcionais de interface (E2E)
npm run test:e2e

# Abrir o painel visual interativo do Playwright (UI Mode)
npm run test:ui

# Abrir o relatório HTML da última execução
npm run report
```

---

### 5.2. Execuções Específicas via Linha de Comando (Playwright CLI)

#### A. Por Pasta / Módulo:
```bash
# Executar apenas testes da US VZS-142
npx playwright test tests/vzs-142

# Executar apenas testes de regressão
npx playwright test tests/regressao

# Executar um arquivo específico
npx playwright test tests/vzs-142/carrinho-api.spec.js
```

#### B. Por Tags de Negócio (`--grep`):
```bash
# Executar todos os testes que validam cupons (E2E e API)
npx playwright test --grep @cupom

# Executar todos os testes que validam regras de frete
npx playwright test --grep @frete

# Executar apenas os testes negativos e de exceção
npx playwright test --grep @negativo

# Executar testes da US VZS-142 que são de API
npx playwright test --grep "@vzs-142.*@api"
```

#### C. Modo com Navegador Visível (Headed):
```bash
npx playwright test tests/vzs-142/carrinho-e2e.spec.js --headed
```

---

## 📊 6. Visualização de Relatórios de Execução

Ao final da execução dos testes, o Playwright gera um relatório interativo detalhado com o status de cada asserção, payloads enviados, screenshots e traces de falha:

```bash
npx playwright show-report
```

O relatório abrirá automaticamente no seu navegador padrão.

---

## 🔍 7. Diretrizes do Ambiente Técnico e Premissas (Não-Bugs)

Ao analisar os resultados, deve-se considerar as premissas oficiais do ambiente técnico de QA da Verzel Store:
1. **Carrinho em Memória:** Os itens do carrinho são salvos exclusivamente no estado da aba ativa do navegador. Novas abas iniciam com o carrinho vazio.
2. **API sem Persistência:** A criação de pedidos (`POST /api/pedidos`) retorna um identificador simulado no padrão `VZ-000000`, mas não grava registros em banco para consulta posterior.
3. **Pagamento na Entrega:** Não há integração com gateways de pagamento online nem processamento de cartão de crédito.
4. **Sem Controle de Estoque:** A API não valida quantidade de itens em estoque, limitando-se apenas à regra de até 5 unidades por item por pedido.
5. **Comportamento Tolerante vs. Estrito de Cupons:**
   * Em `POST /api/carrinho/calcular`, cupom inválido ou expirado retorna **HTTP 200** com desconto zerado e mensagem explicativa.
   * Em `POST /api/pedidos`, os mesmos cupons são **estritamente rejeitados com HTTP 422**.
