import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/core/alert.service';
import { TipoMaterial } from 'src/app/model/materia-prima';
import { MateriaPrimaService } from 'src/app/services/cadastro/materia-prima.service';
import { DialogGenericoComponent } from 'src/app/shared/dialog/dialog-generico/dialog-generico.component';

@Component({
  selector: 'app-tipo-material',
  templateUrl: './tipo-material.component.html',
  styleUrls: ['./tipo-material.component.scss', '../../../styles/animate-fade-slide-in.scss', '../../../styles/spinner.scss'],
})
export class TipoMaterialComponent implements OnInit {
  constructor(
    private _materiaPrimaService: MateriaPrimaService,
    public dialogo: MatDialog,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.spinnerCarregamento = true;
    this.carregaDados();
  }

  spinnerCarregamento: boolean = false;

  //Colunas da tabela
  displayedColumns: string[] = [
    'nm_sequenc',
    'no_materia',
    'vl_custoun',
    'acoes',
  ];

  //Tabela
  dataSource: MatTableDataSource<TipoMaterial> = new MatTableDataSource<TipoMaterial>();

  //Chama o paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*----------------------Pegar os dados da tabela---------------------------*/
  private carregaDados() {
    this._materiaPrimaService.getTp().subscribe({
      next: (data: TipoMaterial[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinnerCarregamento = false;
      },
    });
  }

  /*----------------------Caixa de Pesquisa---------------------------*/
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*----------------------Caixa de dialogo para adicionar novo---------------------------*/
  abrirDialogo(): void {
    const user = localStorage.getItem('name');
    if (user) {
      const dialogRef = this.dialogo.open(DialogGenericoComponent, {
        maxWidth: '950px',
        data: {
          titulo: 'Adicionar',
          descricao: 'Nome',
          valor: 'Valor de custo',
          cancelar: 'Cancelar',
          confirmar: 'Cadastrar',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result.descricao && result.valor) {
          this.spinnerCarregamento = true;
          this._materiaPrimaService
            .saveTp(result.descricao, result.valor)
            .subscribe(
              () => {
                this.carregaDados();
                this.spinnerCarregamento = false;
                this.alertService.show('Adicionado com sucesso!', 'Fechar');
              },
              () => {
                this.spinnerCarregamento = false;
                this.alertService.show('Erro ao adicionar', 'Fechar');
              }
            );
        } else {
          this.spinnerCarregamento = false;
          this.alertService.show(
            'Ação cancelada ou dados incompletos.',
            'Fechar'
          );
        }
      });
    }
  }

  /*----------------------Excluir da tabela---------------------------*/
  public excluir(nm_sequenc: number): void {
    this.spinnerCarregamento = true;
    this._materiaPrimaService.deleteTp(nm_sequenc).subscribe({
      next: (res) => {
        if (res.status) {
          this.carregaDados();
          this.spinnerCarregamento = false;
          this.alertService.show('Excluído com sucesso!', 'Fechar');
        } else {
          this.spinnerCarregamento = false;
          this.alertService.show('Erro ao excluir!', 'Fechar');
        }
      },
    });
  }
}
