const input = document.getElementById('codigo-input');
const selectmenu = document.getElementById('recargas-type');

function getRespose(data) {
  fetch('http://localhost:3333/api/utilizacao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('red').innerText = "";
      document.getElementById('red2').innerText = "";
      selectmenu.innerHTML = '<option value="no-register">Nenhum Registro</option>';

      if (data.message) {
        document.getElementById('red').innerText = data.message;
        return false;
      }

      if (data.message2) {
        document.getElementById('red2').innerText = data.message2;
        return false;
      }

      let timeResDefault = "";
      let BilheteType = "";
      
      document.getElementById('data').innerText = data.dataRecarga;
      document.getElementById('time').innerText = data.timeRecarga;
      
      let extrainfo = "Minutos";

      if (data.type == 'unico') {
        BilheteType = 'Único'
        timeResDefault = '40 minutos'
      } else if (data.type == 'duplo') {
        BilheteType = 'Duplo'
        timeResDefault = '40 minutos'
      } else if (data.type == 'sete') {
        BilheteType = 'Semanal'
        timeResDefault = '7 dias'
        extrainfo = 'Dias'
      } else {
        BilheteType = 'Mensal'
        timeResDefault = '30 dias'
        extrainfo = 'Dias'
      }

      document.getElementById('type').innerText = BilheteType;
      if (data.timeRes == 0) {
        document.getElementById('time_res').innerText = timeResDefault;
      } else {
        document.getElementById('time_res').innerText = data.timeRes+" "+extrainfo;
      }

      if (data.type == 'duplo') {
        document.getElementById('creditos-label').style.display = 'flex';
      }

      document.getElementById('type').style.filter = 'none';
      document.getElementById('data').style.filter = 'none';
      document.getElementById('time').style.filter = 'none';
      document.getElementById('time_res').style.filter = 'none';
      document.getElementById('creditos').style.filter = 'none';
    })
    .catch(err => console.error(err))
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value == "") return;

  if (selectmenu.value == "no-register") return;

  let data = {
    "codigo-input": input.value,
    "codigo-recarga": selectmenu.value
  }
  
  getRespose(data);

})

function PesqCode() {

  if (input.value == "") return;

  fetch('http://localhost:3333/api/utilizacao/pesquisa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "codigo-input": input.value
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('red').innerText = "";
    if (data.message) {
      document.getElementById('red').innerText = data.message;
      return false;
    }

    let HTMLOPTINS = ``;
    let BilheteType = '';
    let DataHora = '';

    for (let i = 0; i < data.length; i++) {
      let StatusRecarga = 'Desativado';

      if (data[i]['TIPO_RECARGA'] == 'unico') {
        BilheteType = 'Único'
      } else if (data[i]['TIPO_RECARGA'] == 'duplo') {
        BilheteType = 'Duplo'
      } else if (data[i]['TIPO_RECARGA'] == 'sete') {
        BilheteType = 'Semanal'
      } else {
        BilheteType = 'Mensal'
      }

      if (data[i]['STATUS_RECARGA'] == 1) {
        StatusRecarga = 'Ativado';
      }

      DataHora = new Date(data[i]["DATA_HORA_RECARGA"]).toLocaleDateString(data[i]["DATA_HORA_RECARGA"])+" "+new Date(data[i]["DATA_HORA_RECARGA"]).toLocaleTimeString(data[i]["DATA_HORA_RECARGA"])

      HTMLOPTINS+= `<option value=${data[i]['COD_RECARGA']}>${BilheteType+" | "+DataHora+" | "+StatusRecarga}</option>`;
    }

    selectmenu.innerHTML = HTMLOPTINS;
  });
}
