import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/alert.service';
import { Funcionario } from 'src/app/model/funcionario';
import { Resposta } from 'src/app/model/resposta';
import { RegisterService } from 'src/app/services/auth/register.service';
import { FuncionarioService } from 'src/app/services/cadastro/funcionario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: [
    './usuario.component.scss',
    '../../styles/spinner.scss',
    '../../styles/animate-fade-slide-in.scss',
  ],
})
export class UsuarioComponent implements OnInit {
  changePasswordForm!: FormGroup;
  spinnerCarregamento: boolean = false;
  funcionario: Funcionario | null = null;

  constructor(
    private registerService: RegisterService,
    private alertService: AlertService,
    private _funcionarioService: FuncionarioService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDados();
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    if (!newPassword || !confirmPassword) {
      return null;
    }
    return newPassword.value === confirmPassword.value
      ? null
      : { mismatch: true };
  }

  getDados() {
    this._funcionarioService.getDados().subscribe({
      next: (data: Funcionario) => {
        this.funcionario = data;
        this.spinnerCarregamento = false;
      },
      error: (err) => {
        console.error('Erro ao buscar dados:', err);
        this.spinnerCarregamento = false;
      },
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const oldPassword = this.changePasswordForm.get('oldPassword')?.value;
      const newPassword = this.changePasswordForm.get('newPassword')?.value;

      if (oldPassword && newPassword) {
        this.update(oldPassword, newPassword);
      }
    }
  }

  public update(senhaAntiga: string, senhaNova: string): void {
    this.spinnerCarregamento = true;
    const token = localStorage.getItem('token');
    if (token != null) {
      this.registerService.update(senhaAntiga, senhaNova, token).subscribe({
        next: (resposta: Resposta) => {
          this.spinnerCarregamento = false;
          if (resposta.status) {
            this.alertService.show('Senha alterada com sucesso!', 'Fechar');
          } else {
            this.alertService.show(`Erro: ${resposta.mensagem}`, 'Fechar');
          }
        },
        error: () => {
          this.spinnerCarregamento = false;
          console.log(senhaAntiga, senhaNova, token);
          this.alertService.show('Erro ao alterar a senha.', 'Fechar');
        },
      });
    } else {
      this.spinnerCarregamento = false;
      this.alertService.show(
        'Token não encontrado. Faça login novamente.',
        'Fechar'
      );
    }
  }
}
