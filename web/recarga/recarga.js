const input = document.getElementById('codigo-input');
let clicktype = "";
let clickvalue = 0;

async function getRespose(data) {
  await fetch('http://localhost:3333/api/recarga', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.status == 200) {
        window.location.href = 'recarga-sucesso.html';
      } else {
        document.getElementById('red').innerText = "Código não encontrado!";
      }
    });
}

function typeClick(type) {
  switch (type) {
    case 1:
      clicktype = "unico";
      clickvalue = 5.00;
      document.getElementById('value_type').innerText = 'R$5,00';
      break;

    case 2:
      clicktype = "duplo";
      clickvalue = 8.50;
      document.getElementById('value_type').innerText = 'R$8,50';
      break;

    case 3:
      clicktype = "sete";
      clickvalue = 31.99;
      document.getElementById('value_type').innerText = 'R$31,99';
      break;

    case 4:
      clicktype = "trinta";
      clickvalue = 125.99;
      document.getElementById('value_type').innerText = 'R$125,99';
      break;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value == "") return;

  let data = {
    "codigo-input": input.value,
    "bilhete-type": clicktype,
    "value-input": clickvalue
  }

  getRespose(data);

})