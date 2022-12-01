const input = document.getElementById('codigo-input');

async function getRespose(data) {
  await fetch('http://localhost:3333/api/utilizacao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        document.getElementById('red').innerText = data.message;
        return false;
      }

      let timeRes = "";
      let BilheteType = "";
      
      document.getElementById('data').innerText = data.data;
      document.getElementById('time').innerText = data.time;
      
      if (data.type == 'unico') {
        BilheteType = 'Único'
        timeRes = '40 minutos'
      } else if (data.type == 'duplo') {
        BilheteType = 'Duplo'
        timeRes = '40 minutos'
      } else if (data.type == 'sete') {
        BilheteType = 'Semanal'
        timeRes = '7 dias'
      } else {
        BilheteType = 'Mensal'
        timeRes = '30 dias'
      }

      document.getElementById('type').innerText = BilheteType;
      document.getElementById('time_res').innerText = timeRes;

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

  let data = {
    "codigo-input": input.value
  }
  getRespose(data);

})
