import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemConstants } from 'src/app/config/system.constants';
import { ApiService } from 'src/app/core/api.service';
import { Funcionario, FuncionarioVw } from '../../model/funcionario';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  protected readonly baseURL = `${SystemConstants.api.url}/funcionario`;

  constructor(private api: ApiService) {}

  public get(): Observable<any[]> {
    return this.api.get<any[]>(`${this.baseURL}`);
  }

  public save(
    descricao: string,
    rg: string,
    cpf: string,
    date: string,
    celular: string,
    descricao2: string,
    date2: string,
    descricao3: string,
    valor: number,
    valorCusto: number,
    valor2: number,
  ): Observable<Funcionario> {
    const body = {
      no_funcion: descricao,
      nm_rgfunci: rg,
      nm_cpfunci: cpf,
      dt_nascime: date,
      nm_celular: celular,
      ds_natural: descricao2,
      dt_emissao: date2,
      no_cargofu: descricao3,
      vl_salario: valor,
      vl_refeica: valorCusto,
      vl_transpo: valor2
    };
    return this.api.post(`${this.baseURL}/save`, body);
  }

  public delete(cd_usuario: number): Observable<any> {
    return this.api.delete(`${this.baseURL}/delete/${cd_usuario}`);
  }
}
