export class Cotacao {
  preco: number;
  data: Date | string;
  hora: String;
  diferenca: number = 0;
  precoTexto: String = '';
  dataTexto: string | null = '';

  constructor(preco: number, data: string | Date, hora: String) {
    this.preco = preco;
    this.data = data;
    this.hora = hora;
  }
}

export class Modal {
  open: boolean = false;
  title: string = '';
  msg: string = '';
}