# TP1-TESTE_DE_SOFTWARE
Repositório criado para atividade da disciplina Teste de Software 2025_02

## Membros do grupo
- Estevão Felipe da Fonseca
- João Gilberto Pereira Monteiro Vaz
- Lucas Fernandes Santos
- Renato Gabino Diniz

## Sistema: Blog de Posts

Este projeto implementa um sistema de blog simples desenvolvido com foco na prática de testes de software. O sistema permite operações CRUD (Create, Read, Update, Delete) para posts de blog, incluindo funcionalidades de busca e paginação.

### Principais Funcionalidades
- **Listagem de posts** com paginação (5 posts por página)
- **Criação de novos posts** com título, slug e conteúdo
- **Visualização individual** de posts por slug
- **Edição de posts** existentes
- **Exclusão de posts**
- **Busca de posts** por título ou conteúdo
- **Interface web** responsiva com templates EJS

### Tecnologias Utilizadas

#### Backend
- **Node.js** - Runtime JavaScript
- **Fastify** - Framework web rápido e eficiente
- **Better SQLite3** - Banco de dados SQLite embarcado
- **EJS** - Template engine para renderização server-side

#### Plugins e Middlewares
- **@fastify/view** - Suporte a templates
- **@fastify/static** - Servir arquivos estáticos
- **@fastify/cors** - Configuração de CORS
- **@fastify/helmet** - Cabeçalhos de segurança
- **@fastify/compress** - Compressão de resposta
- **fastify-graceful-shutdown** - Encerramento gracioso

#### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP

### Estrutura do Projeto
```
src/
├── config/         # Configurações (DB, env, logger)
├── controllers/    # Controladores das rotas
├── middleware/     # Middlewares customizados
├── public/         # Arquivos estáticos (CSS, JS)
├── routes/         # Definição das rotas
├── views/          # Templates EJS
└── app.js          # Arquivo principal da aplicação

tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
└── setup.js        # Configuração dos testes
```

### Como Executar os Testes Localmente

#### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

#### Passos para Executar

1. **Clone o repositório e instale as dependências:**
```bash
git clone <url-do-repositorio>
cd TP1-TESTE_DE_SOFTWARE
npm install
```

2. **Execute todos os testes:**
```bash
npm test
```

3. **Execute o servidor em modo desenvolvimento (opcional):**
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:3000`

#### Tipos de Testes Implementados

- **Testes Unitários** (`tests/unit/`): Testam controladores individualmente
- **Testes de Integração** (`tests/integration/`): Testam fluxos completos da API
- **Cobertura de Código**: Disponível na pasta `coverage/` após execução dos testes

### Objetivo do Projeto

O objetivo principal não é apenas a construção da aplicação, mas demonstrar como a implementação de testes auxilia na manutenção, evolução e confiabilidade de sistemas de software, aplicando diferentes tipos de testes (unitários e de integração) em um projeto real.