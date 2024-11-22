export interface Produtos {
  id_produto: number;
  ds_produto: string;
  vl_produto: number;
  vl_custopr: number;
  ds_corprod: string;
  id_cliente: number;
  no_cliente: string;
}

export interface ProdutoCusto {
  nm_sequenc: number;
  id_produto: number;
  id_materia: number;
  qt_materia: number;
  vl_totcust: number;
}

export interface ProdutoCustoVw {
  id_produto: number;
  id_materia: number;
  qt_materia: number;
}