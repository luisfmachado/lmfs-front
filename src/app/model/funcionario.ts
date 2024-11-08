export interface Funcionario {
    cd_usuario: number;
    no_funcion: string;
    nm_rgfunci: string;
    nm_cpfunci: string;
    dt_nascime: string;
    nm_celular: string;
    ds_natural: string;
    dt_emissao: string;
    no_cargofu: string;
    vl_salario: number;
    vl_refeica: number;
    vl_transpo: number;
}

export interface FuncionarioVw {
    cd_usuario: number;
    no_funcion: string;
    dt_emissao: string;
    no_cargofu: string;
}