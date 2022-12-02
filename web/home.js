const button = document.querySelectorAll("li");

let armazem = [
  `<div>
        <h2>Gere um <green>código único</green><br>para o seu bilhete</h2>
        <h4>Clique abaixo para mais informações</h4>
        <a href="geracao/geracao.html">SAIBA MAIS<img src="img/aviao-de-papel.png"
                style="width:18px;margin: 0 0 0 10px" /></a>
    </div>
    <img src="img/geracao-home.png" alt="">`,


  `<div>
        <h2><green>Recarregue</green> de acordo <br>com sua necessidade</h2>
        <h4>Clique abaixo para mais informações</h4>
        <a href="recarga/recarga.html">SAIBA MAIS<img src="img/aviao-de-papel.png"
                style="width:18px;margin: 0 0 0 10px" /></a>
    </div>
    <img src="img/recarga-home.png" alt="" style="width:288px">`,


  `<div>
        <h2>Utilize a qualquer <green>momento</green><br>em qualquer <green>lugar</green></h2>
        <h4>Clique abaixo para mais informações</h4>
        <a href="utilização/utilizacao.html">SAIBA MAIS<img src="img/aviao-de-papel.png"
                style="width:18px;margin: 0 0 0 10px" /></a>
    </div>
    <img src="img/utilizacao-home.png" alt="" style="width:288px">`,


  `<div>
        <h2>Veja o histórico do seu<br><green>bilhete único</green></h2>
        <h4>Clique abaixo para mais informações</h4>
        <a href="historico/historico.html">SAIBA MAIS<img src="img/aviao-de-papel.png"
                style="width:18px;margin: 0 0 0 10px" /></a>
    </div>
    <img src="img/historico-home.png" alt="" style="width:288px">`
]

let number = 0;

for (let i = 0; i < button.length; i++) {
  button[i].addEventListener("click", () => {
    button[number].classList.remove("activate");
    button[i].classList.add("activate");
    document.querySelector(".type_area").innerHTML = armazem[i]
    number = i;
  })
}


const getQtd = () => {
  fetch('http://localhost:3333/api/home').then(data => data.json()).then(res => {
    document.getElementById('qtd_g').innerText = res.qtd_geracao;
    document.getElementById('qtd_r').innerText = res.qtd_recarga;
    document.getElementById('qtd_u').innerText = res.qtd_utilizacao;
  }).catch(err => console.log(err))
}

getQtd();