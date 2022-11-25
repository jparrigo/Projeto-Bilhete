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

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input.value == "") return;

  let data = {
    "codigo-input": input.value,
    "bilhete-type": clicktype
  }

  getRespose(data);

})