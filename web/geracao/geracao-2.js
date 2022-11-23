
async function getCode() {
  await fetch('http://localhost:3333/api/geracao')
    .then(response => response.json())
    .then(data => {
      document.getElementById("code").innerHTML = `${data.codigo}`;
    })
    .catch(() => {
      document.getElementById("code").innerHTML = '<red>Não foi possivel gerar o código!</red>';
      document.getElementById("head-code").innerText = 'Tente Novamente!';
    })

  document.getElementById("backload").innerHTML = ``;
}

getCode()