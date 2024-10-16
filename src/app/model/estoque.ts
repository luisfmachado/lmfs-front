export interface Estoque {
    id_estoque: number;
    ds_estoque: string;
    id_produto: number;
    qt_produto: number;
    dt_movimen: string;
    vl_custopr: number;
    vl_pgtotal: number;
}

export interface EstoqueVw {
    id_estoque: number;
    ds_estoque: string;
    dt_movimen: string;
    vl_pgtotal: number;
}

export interface Produtos {
    id_produto: number;
    qt_produto: number;
    id_estoque: number;
}