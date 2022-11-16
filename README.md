# Bem vinda(o) ao desafio fullstack ng.cash

## Dependências necessarias para executar o projeto

- node v16.18.1
- docker v20.10.21
- docker-compose v2.12.2

## Antes de executar o projeto você deve

- **OBS: Verifique se você está na pasta raiz do projeto para execultar os comandos abaixo `pasta ng-challenge`.**

- Intalar todas as dependencias necessarias com `npm rum install:project`.
- Para criar o database rode `npm run migrate:dev` esse comando vai rodar o comando `npx prisma migrate dev` no repositório do back-end e gerar as tabelas do banco de dados.

## Comandos para execução do projeto

- `npm rum compose:up` vai rodar o `docker-compose up` com algumas flags para rodar os containers do front-end, back-end e database.
- Para parar a execução dos containers front-end, back-end e database, utilize `npm rum compose:down` que irá rodar o comando `docker-compose down` com algumas flags.

## Portas da aplicação

- Front-End: vai rodar na porta `3000`.
- Back-End: vai rodar na porta `3001`.
- Bando de dados vai rodar na porta `5432`.
