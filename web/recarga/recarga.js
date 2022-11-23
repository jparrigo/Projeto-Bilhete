const input = document.getElementById('codigo-input');
let clicktype = "";

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
      document.getElementById('value_type').innerText = 'R$10,00';
      break;

    case 2:
      clicktype = "duplo";
      document.getElementById('value_type').innerText = 'R$18,00';
      break;

    case 3:
      clicktype = "sete";
      document.getElementById('value_type').innerText = 'R$110,00';
      break;

    case 4:
      clicktype = "trinta";
      document.getElementById('value_type').innerText = 'R$500,00';
      break;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value == "") return;

  let data = {
    "codigo-input": input.value,
    "bilhete-type": clicktype
  }

  getRespose(data);

})