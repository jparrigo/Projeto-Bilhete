import express from 'express'
import cors from 'cors'
import { ConverteTime, generateCode } from './src/commands/functions.js'
import { createConnection } from './src/banco/createConnection.js'

const app = express()

app.use(cors());
app.use(express.json())

//?-----------------------------------------------------------------------------------------------------------------
//? FUNÇÃO PARA VERIFICAR E INSERIR CODIGO DO BILHETE
//?-----------------------------------------------------------------------------------------------------------------
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
//?-----------------------------------------------------------------------------------------------------------------
//? API DE DADOS DA HOME PAGE
//?-----------------------------------------------------------------------------------------------------------------
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
//?-----------------------------------------------------------------------------------------------------------------
//? API DE GERAÇÃO
//?-----------------------------------------------------------------------------------------------------------------
app.get('/api/geracao', async (req, res) => {

  const { code } = await VerifyCode();

  res.json(
    {
      "codigo": code,
    }
  )
})
//?-----------------------------------------------------------------------------------------------------------------
//? API DE RECARGA
//?-----------------------------------------------------------------------------------------------------------------
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
        VALUES (:1, :2, :3, :4, :5)`,
      [body["codigo-input"],body["bilhete-type"],today,ConverteTime(),body["value-input"]],
      {autoCommit: true},
    )

    connection.close();
    
    return res.status(200).json("OK")
  }

  return res.status(204).json("No Code Find")
})
//?-----------------------------------------------------------------------------------------------------------------
//? API DE UTILIZAÇÃO
//?-----------------------------------------------------------------------------------------------------------------
app.post('/api/utilizacao', async (req, res) => {
  const body = req.body;
  console.log(body);
  //verificar se o codigo existe
  const { connection } = await createConnection();

  const haveCode = await connection.execute(
    `SELECT *
    FROM geracao
    WHERE cod_bilhete = :id`,
    [body['codigo-input']],
  )

  console.log(haveCode);

  if (haveCode.rows[0] == undefined ) {
    connection.close();
    return res.status(404).json({"message": 'Codigo não encontrado!'});
  }
  
  //verificar se tem uma recarga no codigo
  const haveCharge = await connection.execute(
    `SELECT * FROM recarga WHERE cod_bilhete = :1 ORDER BY DATA_RECARGA DESC`,
    [body['codigo-input']],
  )

  console.log(haveCharge);


  if (haveCharge.rows[0] == undefined ) {
    connection.close();
    return res.status(404).json({"message": 'Recarga não encontrada!'});

  } else {

    const haveUtility = await connection.execute(
      `SELECT * FROM utilizacao WHERE cod_bilhete = :1 AND tipo_utilizacao = :2`,
      [body['codigo-input'],haveCharge.rows[0]['TIPO_RECARGA']],
    )

    if (haveUtility.rows[0] != undefined ) {
      connection.close();
      return res.status(404).json({"message": 'Já foi utilizado!'});
    }

    let today = new Date().toLocaleDateString();
    let time = ConverteTime()

    await connection.execute(
      `INSERT INTO UTILIZACAO
        VALUES (:0,:1,:2,:3)`,
      [body['codigo-input'],haveCharge.rows[0]['TIPO_RECARGA'],today,time],
      {autoCommit: true}
    )

    connection.close();

    return res.status(200).json({
      "codigo-input": body['codigo-input'],
      "type": haveCharge.rows[0]['TIPO_RECARGA'],
      "data": today,
      "time" : time,
    })
  }

  //ver se a recarga esta valida
  //se nao ativar a recarga
})
//?-----------------------------------------------------------------------------------------------------------------
//? API LISTEN
//?-----------------------------------------------------------------------------------------------------------------
app.listen(3333);
