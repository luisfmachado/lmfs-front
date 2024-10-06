import { DatePipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProdutosComponent } from './module/cadastro/produtos/produtos.component';
import { HomeComponent } from './module/home/home.component';
import { LoginComponent } from './module/login/login.component';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { DialogGenericoComponent } from './shared/dialog-generico/dialog-generico.component';
import { MaterialModule } from './shared/material.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { OrcamentoComponent } from './module/cadastro/orcamento/orcamento.component';
import { ClienteComponent } from './module/cadastro/cliente/cliente.component';
import { OrcamentoManualComponent } from './module/cadastro/orcamento-manual/orcamento-manual.component';
import { DialogEdicaoComponent } from './shared/dialog-edicao/dialog-edicao.component';
import { EstoqueComponent } from './module/cadastro/estoque/estoque.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DialogGenericoComponent,
    ProdutosComponent,
    OrcamentoComponent,
    ClienteComponent,
    OrcamentoManualComponent,
    DialogEdicaoComponent,
    EstoqueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CurrencyMaskModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideEnvironmentNgxMask(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
