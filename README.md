# ToDo API

Esse projeto foi realizado vizando uma API Rest com cadastro de usuários que podem registrar, listar, excluir e completar suas tarefas do dia a dia usando as tecnologias: Node.js, Express, Typescript, TypeORM, Jest, Yup, Bcryptjs, dotenv, JasonWebToken.

## Documentação

A documentação deste projeto está contida no documento `Insomnia_configs.json`, basta copiar o código dentro do documento e realizar a <a href="https://docs.insomnia.rest/insomnia/import-export-data" target="_blank">importação</a> dentro do Insomnia. Neste documento estão contidos exemplos, enviroments e testes manuais das rotas da API. Cada parte da documentação possui a forma requerida do body para ca uma das situações utilizadas.

## Configurações

Para utilizar esta API em desenvolvimento basta clonar este repositório em sua máquina local, e seguir as etapas abaixo.

1. Instalar as dependências:

```
  yarn install ou npm install
```

2. Criar um arquivo `.env` e preenchê-lo com os dados seguindo o arquivo `.env.example` para conexão com o bando de dados PostgreSQL.

```
  POSTGRES_HOST="seu host"
  POSTGRES_PORT="porta do PostgreSQL"
  POSTGRES_USER="seu usuário PostgreSQL"
  POSTGRES_PASSWORD="sua senha do PostgreSQL"
  POSTGRES_DATABASE="nome da database"
  SECRET_KEY="chave secreta"
  APP_PORT="port que a aplicação deve rodar"
```

3. Rodar a aplicação utilizandoo comando:

```
  yarn dev
```
