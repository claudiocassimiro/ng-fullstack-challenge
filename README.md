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

## Rotas do back-end e payloads a serem passados

### Users: OBS - O nome do usuário precisa ter pelo menos 4 caracteres, enquanto a senha precisa ter 8 caracteres, sendo um desses caracteres um número e o outro uma letra maiúscula.

<br />

#### payload para rota post users/create:

1. username: string
2. password: string

`users/create retorna um status 200 e uma mensagem: Successfully registered user`

#### payload para rota post users/login:

1. username: string
2. password: string

`users/login retorna um status 200 e um payload com os dados:`

1. token: string; token do usuario
2. id: string; id do usuario
3. accountId: string; id da conta do usuário

<br />

### Accounts: OBS - Assim que um usuário é criado, automaticamente a sua conta também é criada.

#### payload para rota post accounts/balance

1. accountId: string; id da conta do usuário

`accounts/balance retorna um status 200 e o saldo da conta, que logo ao ser criada já é de R$100`

#### payload para rota post accounts/cashout

1. cashOutUsername: string; nome de quem está transferindo
2. cashOutAccountId: string; id da conta de quem está transferindo
3. cashInUsername: string; nome de quem vai recebendo a transferência
4. balance: number; valor a ser transferido

`accounts/cashout retorna um status 200 e a mensagem: Successful transfer`

<br />

### Transactions: OBS - uma transaction é automaticamente criada na tabela assim que acontece uma transferencia.

#### payload para rota post transactions/all

1. accountId: string; id da conta do usuário

`transactions/all recebe o id da conta e retorna todas as transferências que foram feitas ou recebidas pela conta no formato:`

1. id: string; id da transferência
2. debitedAccountId: string; id da conta que transferiu
3. creditedAccountId: string; id da conta que recebeu a transferência
4. value: number; valor transferido
5. createdAt: dia que a transferência aconteceu

#### payload para rota post transactions/bydate

1. accountId: string; id da conta do usuário
2. date: string; data da transferencia no formato yyyy-mm-dd

`transactions/bydate retorna um array de transferências no formato:`

1. type: string; tipo da transferencia, existem dois tipos possiveis, cashOut/cashIn
2. id: string; id da transferência
3. debitedAccountId: string; id da conta que transferiu
4. creditedAccountId: string; id da conta que recebeu a transferência
5. value: number; valor transferido
6. createdAt: dia que a transferência aconteceu

#### payload para rota post transactions/type

1. accountId: string; id da conta
2. type: string; tipo buscado de transferencia cashOut ou cashIn

`transactions/bytype retorna um array de transferências no formato:`

1. type: string; tipo da transferencia, que foi passado no body da request
2. id: string; id da transferência
3. debitedAccountId: string; id da conta que transferiu
4. creditedAccountId: string; id da conta que recebeu a transferência
5. value: number; valor transferido
6. createdAt: dia que a transferência aconteceu
