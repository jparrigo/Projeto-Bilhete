
//Função para Converte o Tempo

export function ConverteTime (timestamp) {

    let FullDate = new Date(timestamp).toLocaleDateString(timestamp)
    let FullTime = new Date(timestamp).toLocaleTimeString(timestamp)

    return { FullDate,FullTime }
}

// Função para gerar código único

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateCode() {
  let result = '';
  let length = 14;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    if (i == 4 || i == 9) {
      result += '-';
    } else {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }

  return result;
}