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

  let today = Date.now();
    await connection.execute(
      `INSERT INTO GERACAO
        VALUES (:0,:1)`,
      [code,today],
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

    let today = Date.now();

    const { connection } = await createConnection();

    await connection.execute(
      `INSERT INTO recarga (cod_bilhete,tipo_recarga,data_hora_recarga,valor_recarga,status_recarga) 
        VALUES (:1, :2, :3, :4, :5)`,
      [body["codigo-input"],body["bilhete-type"],today,body["value-input"],0],
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

  const { connection } = await createConnection();
  
  //verificar se tem uma recarga no codigo
  const haveCharge = await connection.execute(
    `SELECT * FROM recarga WHERE cod_bilhete = :1 AND cod_recarga = :2`,
    [body['codigo-input'],body['codigo-recarga']],
  )

  //verificar se contem uma utilizacao
  const haveUtility = await connection.execute(
    `SELECT * FROM utilizacao WHERE cod_bilhete = :1 AND tipo_utilizacao = :2 AND cod_recarga = :3`,
    [body['codigo-input'],haveCharge.rows[0]['TIPO_RECARGA'],haveCharge.rows[0]['COD_RECARGA']],
  )

  let today = Date.now();

  let TimeRes = 0;
  if (haveUtility.rows.length != 0) {
    if (haveUtility.rows[0]['TIPO_UTILIZACAO'] == 'unico') {
      TimeRes = 40 - (Math.floor(today - haveUtility.rows[0]['DATA_HORA_UTILIZACAO']) / 60000);

      if (TimeRes <= 0) {

        await connection.execute(
          `DELETE FROM utilizacao WHERE cod_bilhete = :1 AND cod_recarga = :2`,
          [body['codigo-input'],body['codigo-recarga']],
          {autoCommit: true}
        )

        await connection.execute(
          `DELETE FROM recarga WHERE cod_bilhete = :1 AND cod_recarga = :2`,
          [body['codigo-input'],body['codigo-recarga']],
          {autoCommit: true}
        )

        connection.close();
        return res.status(404).json({"message2": 'Tempo esgotado!'});
      }
    } else if (haveUtility.rows[0]['TIPO_UTILIZACAO'] == 'duplo') {
      TimeRes = 40 - (Math.floor(today - haveUtility.rows[0]['DATA_HORA_UTILIZACAO']) / 60000);

      if (TimeRes <= 0) {

        await connection.execute(
          `DELETE FROM utilizacao WHERE cod_bilhete = :1 AND cod_recarga = :2`,
          [body['codigo-input'],body['codigo-recarga']],
          {autoCommit: true}
        )

        if(haveCharge.rows[0]['STATUS_RECARGA'] == 2) {
          await connection.execute(
            `DELETE FROM recarga WHERE cod_bilhete = :1 AND cod_recarga = :2`,
            [body['codigo-input'],body['codigo-recarga']],
            {autoCommit: true}
          )
        } else {
          await connection.execute(
            `UPDATE recarga SET status_recarga = 2 WHERE cod_bilhete = :1 AND cod_recarga = :2`,
            [body['codigo-input'],body['codigo-recarga']],
            {autoCommit: true}
          )
        }

        connection.close();
        return res.status(404).json({"message2": 'Tempo esgotado!'});
      }
    } else if (haveUtility.rows[0]['TIPO_UTILIZACAO'] == 'sete') {
      TimeRes = (7 * 1440) - (Math.floor(today - haveUtility.rows[0]['DATA_HORA_UTILIZACAO']) / 60000);

      if (TimeRes < 0) {

        await connection.execute(
          `DELETE FROM utilizacao WHERE cod_bilhete = :1 AND cod_recarga = :2`,
          [body['codigo-input'],body['codigo-recarga']],
          {autoCommit: true}
        )

        await connection.execute(
          `DELETE FROM recarga WHERE cod_bilhete = :1 AND cod_recarga = :2`,
          [body['codigo-input'],body['codigo-recarga']],
          {autoCommit: true}
        )

        connection.close();
        return res.status(404).json({"message2": 'Tempo esgotado!'});
      }
    } else if (haveUtility.rows[0]['TIPO_UTILIZACAO'] == 'trinta') {
      TimeRes = (30 * 1440) - (Math.floor(today - haveUtility.rows[0]['DATA_HORA_UTILIZACAO']) / 60000);

      if (TimeRes < 0) {

        await connection.execute(
          `DELETE FROM utilizacao WHERE cod_bilhete = :1 AND cod_recarga = :2`,
          [body['codigo-input'],body['codigo-recarga']],
          {autoCommit: true}
        )

        await connection.execute(
          `DELETE FROM recarga WHERE cod_bilhete = :1 AND cod_recarga = :2`,
          [body['codigo-input'],body['codigo-recarga']],
          {autoCommit: true}
        )

        connection.close();
        return res.status(404).json({"message2": 'Tempo esgotado!'});
      }
    }
  } else {
    await connection.execute(
      `INSERT INTO UTILIZACAO
        VALUES (:0,:1,:2,:3)`,
      [body['codigo-input'],haveCharge.rows[0]['COD_RECARGA'],haveCharge.rows[0]['TIPO_RECARGA'],today],
      {autoCommit: true}
    )

    await connection.execute(
      `UPDATE recarga SET status_recarga = 1 WHERE cod_bilhete = :1 AND tipo_recarga = :2 AND cod_recarga = :3`,
      [body['codigo-input'],haveCharge.rows[0]['TIPO_RECARGA'],haveCharge.rows[0]['COD_RECARGA']],
      {autoCommit: true}
    )
  }

  connection.close();
  //retornar a api valores da utilizacao
  let TimeConv = ConverteTime(today);
  if(haveUtility.rows.length != 0) {
    TimeConv = ConverteTime(haveUtility.rows[0]['DATA_HORA_UTILIZACAO']);
  }

  if (haveUtility.rows[0]['TIPO_UTILIZACAO'] == 'sete' || haveUtility.rows[0]['TIPO_UTILIZACAO'] == 'trinta') {
    TimeRes = Math.floor(TimeRes / 1440);
  }

  return res.status(200).json({
    "codigo-input": body['codigo-input'],
    "type": haveCharge.rows[0]['TIPO_RECARGA'],
    "dataRecarga": TimeConv.FullDate,
    "timeRecarga": TimeConv.FullTime,
    "timeRes": TimeRes
  })
})

app.post('/api/utilizacao/pesquisa', async (req, res) => {
    const body = req.body;
    const code = body['codigo-input'];

    const { connection } = await createConnection();

    const haveCode = await connection.execute(
      `SELECT *
      FROM geracao
      WHERE cod_bilhete = :id`,
      [code],
    )
  
    if (haveCode.rows.length == 0 ) {
      connection.close();
      return res.status(404).json({"message": 'Codigo não encontrado!'});
    }

    //verificar se tem uma recarga no codigo
    const haveCharge = await connection.execute(
      `SELECT * FROM recarga WHERE cod_bilhete = :1 ORDER BY data_hora_recarga DESC`,
      [code],
    )

    if (haveCharge.rows.length == 0 ) {
      connection.close();
      return res.status(404).json({"message": 'Recarga não encontrada!'});
    }

    return res.json(haveCharge.rows);
})
//?-----------------------------------------------------------------------------------------------------------------
//? API DE HISTORICO
//?-----------------------------------------------------------------------------------------------------------------
app.post('/api/historico', async (req, res) => {
  const body = req.body;

  const { connection } = await createConnection();

  const haveCode = await connection.execute(
    `SELECT *
    FROM geracao
    WHERE cod_bilhete = :id`,
    [body['codigo-input']],
  )

  if (haveCode.rows.length == 0 ) {
    connection.close();
    return res.status(404).json({"message": 'Codigo não encontrado!'});
  }

  //verificar se tem uma recarga no codigo
  const haveCharge = await connection.execute(
    `SELECT * FROM recarga WHERE cod_bilhete = :1 ORDER BY data_hora_recarga DESC`,
    [body['codigo-input']],
  )

  const haveUtility = await connection.execute(
    `SELECT * FROM utilizacao WHERE cod_bilhete = :1`,
    [body['codigo-input']],
  )

  connection.close();

  let RecargaData = []
  let UtilizacaoData = []
  if (haveCharge.rows.length != 0 ) {
    for(let i = 0; i < haveCharge.rows.length; i++) {
      let TimeConv = ConverteTime(haveCharge.rows[i]['DATA_HORA_RECARGA']);
      RecargaData.push([
        TimeConv.FullDate+"  "+TimeConv.FullTime,
        haveCharge.rows[i]['TIPO_RECARGA'],
        haveCharge.rows[i]['VALOR_RECARGA'].toFixed(2),
      ])
    }

    if (haveUtility.rows.length != 0 ) {
      for(let i = 0; i < haveUtility.rows.length; i++) {
        let TimeConv = ConverteTime(haveUtility.rows[i]['DATA_HORA_UTILIZACAO'] * 1000);
        UtilizacaoData.push([
          TimeConv.FullDate+"  "+TimeConv.FullTime,
          haveUtility.rows[i]['TIPO_UTILIZACAO'],
        ])
      }
    }
  }

  let TimeConv = ConverteTime(haveCode.rows[0]['DATA_HORA_GERACAO']);
  console.log(UtilizacaoData);
  return res.json({
    "codigo": body['codigo-input'],
    "geracao": {
      "data-hora-geracao": TimeConv.FullDate+"  "+TimeConv.FullTime,
    },
    "recarga": RecargaData,
    "utilizacao": UtilizacaoData
  })

})
//?-----------------------------------------------------------------------------------------------------------------
//? API LISTEN
//?-----------------------------------------------------------------------------------------------------------------
app.listen(3333);
