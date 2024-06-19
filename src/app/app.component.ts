import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cotacao, Modal } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  cotacaoAtual: number = 0;
  cotacaoPorPeriodoLista: Cotacao[] = [];
  dataInicial: string = '';
  dataFinal: string = '';
  hoje: string = '';
  diferenca: string = '';
  menorAtual: boolean = false;
  modal: Modal = new Modal;
  loading: boolean = false;
  diaAnterior: number = 0;
  
  constructor(
    private cotacaoDolarService: CotacaoDolarService,
    private dateFormat: DatePipe
  ) {
    this.getDiaAnterior(); 
  }
  
  async ngOnInit(): Promise<void> {
    await this.getCotacaoAtual(); 
    this.initDatas();
  }

  public initDatas(): void {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    this.dataInicial = this.dateFormat.transform(new Date(year, month, 1), "yyyy-MM-dd") || '';
    this.dataFinal = this.dateFormat.transform(new Date(), "yyyy-MM-dd") || '';
    this.hoje = this.dateFormat.transform(new Date(), "yyyy-MM-dd") || '';
  }

  public bugMoedaAtual(): void {
    this.openModal("Erro", `Valor do dia ${this.dateFormat.transform(new Date(), "dd/MM/yyyy")} indisponível no momento, exibiremos o valor mais recente disponível.`);
    this.cotacaoAtual = this.diaAnterior;
  }

  public async getCotacaoAtual(): Promise<void> {
    try {
      const c: Cotacao = await this.cotacaoDolarService.getCotacaoAtual().toPromise();
      if(c && c.preco != null){
        this.cotacaoAtual = c.preco;
      }else{
        this.bugMoedaAtual();
      }
    } catch (error) {
      this.openModal("Erro ao obter cotação atual", "Por favor tente novamente mais tarde.");
    }
  }

  public async getCotacaoPorPeriodo( dataInicialString: string, dataFinalString: string ): Promise<void> {
    this.loading = true;
    if(!this.valideDate()){
      this.openModal("Erro", "Insira uma data valida!");
      this.initDatas();
      this.loading = false;
      return;
    }

    try {
      this.cotacaoPorPeriodoLista = [];
      const dataInicial = this.dateFormat.transform(dataInicialString, "MM-dd-yyyy") || '';
      const dataFinal = this.dateFormat.transform(dataFinalString, "MM-dd-yyyy") || '';
      
      const res: Cotacao[] = await this.cotacaoDolarService.getCotacaoPorPeriodoFront(dataInicial, dataFinal, this.menorAtual).toPromise();

      if(res){
        this.cotacaoPorPeriodoLista = res;
        this.cotacaoPorPeriodoLista.forEach((el: Cotacao) => {
          el.diferenca = el.preco - this.cotacaoAtual;
        });
      }
      if(this.cotacaoPorPeriodoLista.length == 0){
        this.openModal("Erro", "Nenhum dado encontrado para o periodo informado!");
      }
    }catch (error) {
      if(this.menorAtual){
        this.openModal("Erro", "Nenhum dado encontrado pois valor atual não foi encontrado!");
      }else{
        this.openModal("Erro", "Tivemos um erro ao obter os dados!");
      }
    }finally{
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    }
  }

  public async getDiaAnterior(): Promise<void> {
    try {
      const res: Cotacao = await this.cotacaoDolarService.getDiaAnterior().toPromise();
      if(res && res.preco != null){
        this.diaAnterior = res.preco;
      }
    } catch (error) {
      console.log("Erro ao obter cotação do dia anterior. Por favor tente novamente mais tarde.");
    }
  }

  toggleMenorAtual(event: MatSlideToggleChange): void{
    this.menorAtual = event.checked;
  }

  public valideDate(): boolean {
    if (this.dataInicial && this.dataFinal) {
      const dataInicial = new Date(this.dataInicial);
      const dataFinal = new Date(this.dataFinal);
      if ((dataInicial > dataFinal) || (dataFinal > new Date() || dataInicial > new Date())) {
        return false;
      }else{
        return true;
      }
    }
    return false;
  }

  public closeModal(reload?: boolean): void {
    this.modal.open = false;
    this.modal.title = '';
    this.modal.msg = '';
    if(reload){
      window.location.reload();
    }
  }

  public openModal(title: string, msg: string): void {
    this.modal.open = true;
    this.modal.title = title;
    this.modal.msg = msg;
  }
}
