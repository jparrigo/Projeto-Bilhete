const input = document.getElementById('codigo-input');

async function getRespose(data) {
  await fetch('http://localhost:3333/api/utilizacao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.status != 200) {
        document.getElementById('red').innerText = "Código não encontrado!";
        return false;
      }

      return res.json()
    })
    .then(data => {
      if (data == false) return false;

      document.getElementById('type').innerText = data.type;
      document.getElementById('data').innerText = data.data;
      document.getElementById('time').innerText = data.time;
      document.getElementById('time_res').innerText = data.timeRes;

      if (data.type == 'unico') {
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

  let data = {
    "codigo-input": input.value
  }
  getRespose(data);

})
