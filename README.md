
![Logo](https://capibara-express.vercel.app/img/logo.png)


# Capibara Express 

Um site de geração, recarga e utilização de bilhete urbano.




## Documentação da API

#### Retorna a quantidade de bilhetes (gerados,recarregados e utilizados)

```bash
  GET /api/home
```
Não é necessario passar parametros!


#### Retorna um código único para o seu bilhete

```bash
  GET /api/geracao
```
Não é necessario passar parametros!

#### Armazenar dados sobre a recarga do bilhete

```bash
  POST /api/recarga
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `codigo-input` | `string` | **Obrigatório**. Código do bilhete |
| `type-input` | `string` | **Obrigatório**. Tipo da recarga |

#### Armazenar dados sobre a utilizacao do bilhete

```bash
  POST /api/utilizacao
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `codigo-input` | `string` | **Obrigatório**. Código do bilhete |

#### Retornar os dados armazenados sobre o bilhete

```bash
  POST /api/historico
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `codigo-input` | `string` | **Obrigatório**. Código do bilhete |



## Rodando os testes

Para rodar, rode o seguinte comando dentro da pasta ***./server***

```bash
  npm run dev
```


## Autores

- [@João Paulo](https://github.com/goldennZ)
- [@Enrico Farina](https://github.com/goldennZ)
- [@Bruno Fontolan](https://github.com/goldennZ)
- [@Gustavo de Campos](https://github.com/goldennZ)
- [@Vinicius Torres ](https://github.com/goldennZ)

