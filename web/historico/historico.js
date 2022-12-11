const input = document.getElementById('codigo-input');

async function getRespose(code) {
  await fetch('http://localhost:3333/api/historico', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(code)
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        document.getElementById('red').innerText = data.message;
        return false;
      }

      console.log(data);

      if (data.recarga.length > 0) {
        getHistory(data);
      }

      if (data.utilizacao.length > 0) {
        getUtility(data);
      }

      document.getElementById('data-time-geracao').innerText = data.geracao['data-hora-geracao'];
      document.getElementById('data-time-geracao').style.filter = 'none';

    })
    .catch(err => console.error(err))
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value == "") return;

  let code = {
    "codigo-input": input.value
  }

  getRespose(code);

})

function getHistory(data) {
    let TextTitle = ['Data e hora:','Tipo:','Valor:']
    let HtmlRecarga = `<h4>RECARGA</h4>`;
    for (let i = 0; i < data.recarga.length; i++) {
      for (let k = 0; k < data.recarga[i].length; k++) {

        let style = '';
        if (k == 2) {
          style = 'border-bottom: 2px solid #beb7d016;padding-bottom: 12px;';
          data.recarga[i][k] = "R$"+data.recarga[i][k];
        }

        if (data.recarga[i][1] == 'unico') {
          data.recarga[i][1] = 'Único';
        } else if (data.recarga[i][1] == 'duplo') {
          data.recarga[i][1] = 'Duplo';
        } else if (data.recarga[i][1] == 'sete') {
          data.recarga[i][1] = 'Semanal';
        } else if (data.recarga[i][1] == 'trinta') {
          data.recarga[i][1] = 'Mensal'
        }

        HtmlRecarga+=`
        <label style="${style}">
          ${TextTitle[k]}
          <span class="info-recarga">${data.recarga[i][k]}</span>
        </label>
        `
      }
    }

    document.getElementById('dados-recarga').innerHTML = HtmlRecarga;
    document.getElementById('dados-recarga').style.display = 'flex';

    const DadosRecarga = document.querySelectorAll('.info-recarga');

    DadosRecarga.forEach(span => {
      span.style.filter = 'none';
    })
}

function getUtility(data) {
  let TextTitle = ['Data e hora:','Tipo:','Valor: ']
  let HtmlUtilizacao = `<h4>UTILIZAÇÃO</h4>`;
  for (let i = 0; i < data.utilizacao.length; i++) {
    for (let k = 0; k < data.utilizacao[i].length; k++) {

      let style = '';
      if (k == 2) {
        style = 'border-bottom: 2px solid #beb7d016;padding-bottom: 12px;';
        data.utilizacao[i][k] = "R$"+data.utilizacao[i][k];
      }
      
      if (data.utilizacao[i][1] == 'unico') {
        data.utilizacao[i][1] = 'Único';
      } else if (data.utilizacao[i][1] == 'duplo') {
        data.utilizacao[i][1] = 'Duplo';
      } else if (data.utilizacao[i][1] == 'sete') {
        data.utilizacao[i][1] = 'Semanal';
      } else if (data.utilizacao[i][1] == 'trinta') {
        data.utilizacao[i][1] = 'Mensal'
      }

      HtmlUtilizacao+=`
      <label style="${style}">
        ${TextTitle[k]}
        <span class="info-utilizacao">${data.utilizacao[i][k]}</span>
      </label>
      `
    }
  }

  document.getElementById('dados-utilizacao').innerHTML = HtmlUtilizacao;
  document.getElementById('dados-utilizacao').style.display = 'flex';

  const DadosRecarga = document.querySelectorAll('.info-utilizacao');

  DadosRecarga.forEach(span => {
    span.style.filter = 'none';
  })
}
