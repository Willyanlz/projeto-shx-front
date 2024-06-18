import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cotacao } from './cotacao';

@Injectable({ providedIn: 'root' })
export class CotacaoDolarService {
  // private apiServerUrl = 'https://awpserver.duckdns.org:3333/backend';
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  public getCotacaoAtual(): Observable<Cotacao> {
    return this.http.get<Cotacao>(`${this.apiServerUrl}/moeda/atual`);
  }

  public getCotacaoPorPeriodoFront(
    dataInicial: string,
    dataFinal: string,
    menorAtual: boolean
  ): Observable<Cotacao[]> {
    let param: HttpParams = new HttpParams();
    param = param.set('menorAtual', menorAtual);
    return this.http.get<Cotacao[]>(`${this.apiServerUrl}/moeda/${dataInicial}&${dataFinal}`, { params: param });
  }

  public getDiaAnterior(): Observable<Cotacao[]> {
    return this.http.get<Cotacao[]>(`${this.apiServerUrl}/moeda/anterior`);
  }
}
