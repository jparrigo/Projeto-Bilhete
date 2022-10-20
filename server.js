const express = require('express')
const cors = require('cors');
const Convert = require('../server/commands/functions')

const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express()

app.use(cors());
app.use(express.json())

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateString() {
  let result = '';
  let length = 14;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    if (i == 4 || i == 9) {
      result += '-';
    } else {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }

  return result;
}
let code_master = ''
const recursive = async () => {
  let code = generateString();

  let connection = await oracledb.getConnection( {
      user          : "ebd1es82221",
      password      : "Zrqip7",
      connectString : "172.16.12.48:1521/xe"
    })

  const haveCode = await connection.execute(
      `SELECT *
       FROM geracao
       WHERE cod_bilhete = :id`,
      [code],
    )

  if (haveCode.rows != []) {
    let today = new Date().toLocaleDateString()
    await connection.execute(
      `INSERT INTO GERACAO
        VALUES (:0,:1,:2)`,
      [code,today,Convert.ConverteTime()],
      {autoCommit: true}
    )
    connection.close();
    code_master = code;
  } else {
    recursive();
  }
}

app.get('/api/geracao', async (req, res) => {

  await recursive();

  res.json(
    {
      "codigo": code_master,
    }
  )
})

app.post('/api/recarga', (req, res) => {
  const body = req.body;
  console.log(body);
  return res.json([body]);
})


app.listen(3333);
