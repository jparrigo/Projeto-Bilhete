import oracledb from 'oracledb'

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function createConnection() {
    let connection = await oracledb.getConnection({
      user          : "ebd1es82221",
      password      : "Zrqip7",
      connectString : "172.16.12.48:1521/xe"
    })
  
    return { connection }
  }