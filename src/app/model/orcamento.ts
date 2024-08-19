export interface Orcamento {
    id_orcamen: number;
    id_produto: number;
    id_cliente: number;
    qt_produto: number;
}

export interface OrcamentoVW {
    id_orcamen: number;
    ds_orcamen: number;
    dt_orcamen: string;
    vl_totalor: number;
    no_cliente: string;
    dt_entrega: string;
}