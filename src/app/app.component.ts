import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cotacao, Modal } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ModalComponent } from './modal/modal.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  cotacaoAtual: number = 0;
  cotacaoPorPeriodoLista: Cotacao[] = [];
  dataInicial: string = '';
  dataFinal: string = '';
  hoje: string = '';
  diferenca: string = '';
  menorAtual: boolean = false;
  subscription: Subscription = new Subscription();
  modal: Modal = new Modal;
  loading: boolean = false;
  
  constructor(
    private cotacaoDolarService: CotacaoDolarService,
    private dateFormat: DatePipe
  ) {}
  
  ngOnInit() {
    this.getCotacaoAtual();
    this.hoje = this.dateFormat.transform(new Date(), "yyyy-MM-dd") || '';
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    this.dataInicial = this.dateFormat.transform(new Date(year, month, 1), "yyyy-MM-dd") || '';
    this.dataFinal = this.dateFormat.transform(new Date(), "yyyy-MM-dd") || ''; 
  }

  public async getCotacaoAtual(): Promise<void> {
    this.loading = true;
    try {
      const c: Cotacao = await this.cotacaoDolarService.getCotacaoAtual().toPromise();
      if(c && c.preco != null){
        this.cotacaoAtual = c.preco;
      }
    } catch (error) {
      this.openModal("Teste", "testando123");
    }
  }

  public getCotacaoPorPeriodo( dataInicialString: string, dataFinalString: string ): void {

    if(this.valideDate()){
      this.cotacaoPorPeriodoLista = [];
      const dataInicial = this.dateFormat.transform(dataInicialString, "MM-dd-yyyy") || '';
      const dataFinal = this.dateFormat.transform(dataFinalString, "MM-dd-yyyy") || '';

      this.subscription.add(
        this.cotacaoDolarService.getCotacaoPorPeriodoFront(dataInicial, dataFinal, this.menorAtual).subscribe(cotacoes => {
          this.cotacaoPorPeriodoLista = cotacoes;
          this.cotacaoPorPeriodoLista.forEach((el: Cotacao) => {
            el.diferenca = el.preco - this.cotacaoAtual;
          });
        })
      )
    } else {
      this.openModal("Teste", "testando123");
    }
  }

  toggleMenorAtual(event: MatSlideToggleChange): void{
    this.menorAtual = event.checked;
    console.log(this.menorAtual);
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

  public closeModal(): void {
    this.modal.open = false;
    this.modal.title = '';
    this.modal.msg = '';
  }

  public openModal(title: string, msg: string): void {
    this.modal.open = true;
    this.modal.title = title;
    this.modal.msg = msg;
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
