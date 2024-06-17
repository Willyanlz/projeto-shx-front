import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cotacao } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

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
  modal: boolean = false;
  
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

  public getCotacaoAtual() {
    this.subscription.add(
      this.cotacaoDolarService.getCotacaoAtual().subscribe((cotacao: Cotacao) => {
        console.log(cotacao);
        if(cotacao){
          this.cotacaoAtual = cotacao.preco;
        }
      })
    );
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
        console.log('Data inválida');
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
    this.modal = false;
  }

  public openModal(): void {
    this.modal = true;
    console.log('openModal');
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
