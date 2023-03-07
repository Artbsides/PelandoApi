# PelandoApi

Aplicação WebCrawler desenvolvida em [NodeJS 19.7.0](https://nodejs.org), focada no rastreamento de informações relacionadas aos produtos disponibilizados no e-commerce da [C&A](https://www.cea.com.br).

# Lógica Aplicada

A partir de requests http, é necessário retornar alguns dados relacionados ao produto da url requisitada como parâmetro na request. Caso a url do produto seja requisitada mais que uma vez em um intervalo de tempo inferir a 60 minutos, a aplicação não deve realizar a busca pelos dados diretamente na url passada, sendo assim, o fluxo iplementado foi o seguite:

```
[GET REQUEST?url=<url-do-produto>]
 |
 |-->[API verifica se registro existe em cache]
      |-->[Se sim, retorna dados do cache]
            |-->[Fim]

      |
      |-->[Api verifica se registro existe em banco de dados]
            |-->[Se sim, insere em cache]
                  |-->[Verifica se datetime de registro é menor que 60m]
                       |-->[Se sim, retorna dados do banco de dados]
                             |-->[Fim]

      |-->[Api realiza o scrape na url do produto]
            |-->[Insere em banco de dados]
            |-->[Insere no cache]
            |-->[Retorna os dados do banco de dados]
                  |-->[Fim]
```

# Armazenamento de Dados

Para fins de armazenamento de dados, esta aplicação faz uso de [PostgreSQL](https://www.postgresql.org) como fonte de dados principal e [Redis](https://redis.io) como fonte de dados em cache.

# Instalação

Este aplicação foi desenvolvida sob linux utilizando de algumas ferramentas excenciais, sendo assim, é necessário instalar as dependências do projeto listadas abaixo para que seja possível subir todos os serviços para sua execução.

Dependências para execução dockerizada (necessário também para execução de banco de dados):
```
Make
Docker
```

Dependências para execução diretamente em máquina local (opcional):
```
Npm v9.5.0+
NodeJS v19.7.0+
```

Após certificar-se de que as dependências estão instaladas na máquina que irá executar esta aplicação, pode-se facilmente subir os serviços utilizando os comandos listados nos arquivos  `package.json` e/ou `Makefile`.

É recomendado o uso dos comandos `Makefile` para aqueles que desejarem rodar a aplicão completamente dockerizada, neste cenário, não se faz necessária a instalação das dempendências para exeução em máquina local.

# Makefile

O arquivo `Makefile` possui comandos pré-configurados que auxiliam algumas rotinas em ambiente dockerizado, tais como: Disponibilizar banco de dados e cache, inicializar a aplicação, rodar os testes e convenção de código, assim como também manipular arquivos contendo variáveis de ambiente encriptadas e tags no github.

Para exibir a relação de comandos disponíveis e seus respectivos modos de uso, basta aplicar um dos dois comandos abaixo:

```
$ make
$ make help
```

# Inicialização da Aplicação

A abordagem a partir deste ponto será voltada a disponibilização dos serviços e a iniciaização da aplicação de forma dockerizada. Para isso, é necessário que inicialmente as imagens a serem utilizadas no Docker sejam construídas.

Para a construção das imagens, aplique o comando abaixo:

```
$ make build
```

Após a construção das imagens, é necessário disponibilizar o banco de dados e cache, aplique os comandos abaixo:

```
$ make redis
$ make postgres
```

Uma vez que o banco de dados esteja disponível, é necessário aplicar a migração das tabelas, porém, é necessário instalar as dependências do projeto antes disso, sendo assim, aplique os comandos abaixo:

```
$ make packages
$ make migrate-database
```

A partir deste ponto tudo o que é necessário já encontra-se devidamente instalado e disponível. Caso seja necessário executar testes e análise de código, os comandos abaixo devem ser utilizados:

```
$ make tests mode=viewer|cov
$ make code-convention mode=analyzer|fix
```

Por fim, para inicializar a aplicação basta aplicar o seguinte abaixo:

```
$ make start mode=dev|debug|prod
```

Caso corra tudo conforme o esperado e nenhuma variável de ambiente tenha sido previamente modificada, a aplicação estará disponível na url `http://localhost:3000`.

# Utilização

Esta aplicação foi implementada com apenas uma rota, ainda que de forma modular e versionável. É também verdade que neste momento, somente produtos da loja C&A podem ser lidos, alguns exemplos de uso estão listados abaixo.

* Talvez seja necessária a instalação da ferramenta `curl` para aplicar os comandos abaixo, de qualqer forma, é fortemente recomendada a utilização do [Postman](https://www.postman.com) ao invés de linha de comando, toranará a visualização dos retornos mais legível.

```
$ curl --location 'http://localhost:3000?url=https%3A%2F%2Fwww.cea.com.br%2Fmocassim-tratorado-com-fivela-via-uno-preto-1040375-preto%2Fp' \
--header 'ApiVersion: 1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODYyMzkwMjJ9.HS5EXWY9AsspjWX1ytt91qmpLSUxQ-YyVRRuebqUf3g'
```

```
$ curl --location 'http://localhost:3000?url=https%3A%2F%2Fwww.cea.com.br%2Fcompre-tablet-nokia-t20-4gb-ram-64gb-armazenamento-tela-10-4-e-ganhe-fone-de-ouvido-tws-airbuds-branco-multilaser-ph326k-4153078%2Fp' \
--header 'ApiVersion: 1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODYyMzkwMjJ9.HS5EXWY9AsspjWX1ytt91qmpLSUxQ-YyVRRuebqUf3g'
```

```
$ curl --location 'http://localhost:3000?url=https%3A%2F%2Fwww.cea.com.br%2Fcoleira-reflexiva-azul-tam-p-mimo-pp069-4193275%2Fp' \
--header 'ApiVersion: 1' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2ODYyMzkwMjJ9.HS5EXWY9AsspjWX1ytt91qmpLSUxQ-YyVRRuebqUf3g'
```

* É provavel que algumas urls estejam indisponíveis ou eventuais problemas venham a acontecer, ou seja, nem todos os possíveis problemas foram devidamente tratados até o momento.

* É importante dar ênfaze ao header Authorization. Este é um Bearer token do tipo (JWT)[https://jwt.io] que possui apenas a propriedade relacionada a sua data de expiração. Em ambientes reais, é provável que seja necessária a incrementação de outras propriedades para validação. 

# Variáveis de Ambiente

As variáveis de ambiente estão configuradas no arquivo `.env` e estão organizadas por tipo de uso, setadas para desenvolvimento local e toda configuração é aplicada automaticamente tanto para inicialização em ambiente Docker quanto em máquina local.

Caso seja necessário alterar alguma variável, basta editá-las. As alterações serão aplicadas em todos os modos de inicialização.

* Lembre-se de atribuir valor à variável de ambiente `JWT_SECRETS` com alguma string de sua escolha. Para gerar um token válido, acesse o site do JWT e altere a data de expiração utilizando a mesma chave de segurança configurada nas variáveis de ambiente (JWT_SECRETS) sem encodar em Base64.

```
| ----------------------------------- |
| Header                              |
| ----------------------------------- |
| {                                   |
|     "alg": "HS256",                 |
|     "typ": "JWT"                    |
| }                                   |
| ----------------------------------- |
| Payload                             |
| ----------------------------------- |
| {                                   |
|     "exp": 1686239022               |
| }                                   |
| ----------------------------------- |
| Verify Signature                    |
| ----------------------------------- |
| HMACSHA256(                         |
|     base64UrlEncode(header) + "." + |
|     base64UrlEncode(payload),       |
|     [ "secret" ]                    |
| ) [ ] secret base64 encoded         |
| ----------------------------------- |
```

Em ambientes externos voltados a staging e production, as variáveis de ambiente são encriptadas e estão localizadas no diretório `.k8s`, que também possui outras configurações para deploy em [kubernetes](https://kubernetes.io/pt-br).

Para encriptar e/ou desencripar as variáveis de ambiente de staging e production é necessario que o ambiente de infra esteja devidadamente alinhado com esta aplicação, porém, de acordo com o objetivo desta aplicação, este recurso não se faz necessário e não será devidamente documentado neste repositório, ainda assim, caso seja de interesse das partes, notifique-me para a demonstração de uso.

# Workflows

Foram implementadas actions que são executadas em diferentes cenários com o objetivo de aplicar testes e análise de código, assim como também o deploy da aplicação.

Para que as actions relacionadas aos testes e análise de código sejam executadas, basta a realização do push para a branch na qual está recebendo modificações, caso as actions identifiquem problemas, o merge da branch junto a main não será permitido.

Quanto ao deploy, esta action utiliza workflows compartihados e assim como as variáveis de ambiente encriptadas e demais recursos de deploy, é necessário estar alinhado com o ambiente de infra, porém, a nível de explicação, para execução da action, basta criar tags e o processo inicializará.
