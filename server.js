import express from 'express'
import cors from 'cors'
import { ConverteTime, generateCode } from './src/commands/functions.js'
import { createConnection } from './src/banco/createConnection.js'

const app = express()

app.use(cors());
app.use(express.json())

// Função para verificar e inserir novo codigo do bilhete

async function VerifyCode() {

  const { connection } = await createConnection();

  let start = true;
  let code = 0;

  while(start){
      
    code = generateCode();

    const haveCode = await connection.execute(
        `SELECT *
        FROM geracao
        WHERE cod_bilhete = :id`,
        [code],
      )

    if (haveCode.rows[0] == undefined ) break;

  }

  let today = new Date().toLocaleDateString()
    await connection.execute(
      `INSERT INTO GERACAO
        VALUES (:0,:1,:2)`,
      [code,today,ConverteTime()],
      {autoCommit: true}
    )
    
  connection.close();

  return { code }
}

// Api de Home

app.get('/api/home', async (req,res) => {

  const { connection } = await createConnection();

  let qtdGeracao = await connection.execute(`SELECT COUNT(cod_bilhete) "Count" FROM GERACAO`);

  connection.close();
  res.json(
    {
      "qtd_geracao": qtdGeracao.rows[0].Count,
      "qtd_recarga": "0",
      "qtd_utilizacao": "0" 
    }
  )
})

//Api de Geração

app.get('/api/geracao', async (req, res) => {

  const { code } = await VerifyCode();

  res.json(
    {
      "codigo": code,
    }
  )
})

//Api de Recarga

app.post('/api/recarga', async (req, res) => {
  const body = req.body;
  console.log(body);
  console.log(body["codigo-input"]);

  const { connection } = await createConnection();

  const haveCode = await connection.execute(
    `SELECT *
     FROM geracao
     WHERE cod_bilhete = :id`,
    [body["codigo-input"]],
  )

  connection.close();

  if (haveCode.rows[0]) {

    let today = new Date().toLocaleDateString();

    const { connection } = await createConnection();

    await connection.execute(
      `INSERT INTO recarga 
        VALUES (:1, :2, :3)`,
      [body["codigo-input"],body["bilhete-type"],today],
      {autoCommit: true},
    )

    connection.close();
    
    return res.status(200).json("OK")
  }

  return res.status(204).json("No Code Find")
})


app.listen(3333);
