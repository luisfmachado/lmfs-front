export interface MateriaPrima {
    nm_sequenc: number;
    no_materia: string;
    dt_movimen: string;
    tp_pagamen: number;
    id_fornece: number;
    lg_custoad: string;
    no_custoad: string;
    vl_custoad: number;
    tp_custoad: number;
    vl_pgtotal: number;
    vl_pgmater: number;
}

export interface MateriaPrimaVw {
    nm_sequenc: number;
    no_materia: string;
    dt_movimen: string;
    vl_pgtotal: number;
    no_fornece: string;
}

export interface tipoPagamento {
    id: number;
    nome: string;
}

export interface tipoPagamentoAdd {
    id:number;
    nome: string;
}

export interface PagamentoParceladoCartao {
    id:number;
    nome: string;
}