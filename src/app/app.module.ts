import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {PagesModule} from './pages/pages.module';
import {AppRoutingModule} from './app.routing.module';
import {JwtInterceptor} from './core/interceptors/token.interceptor';
import {ErrorInterceptor} from './core/interceptors/error.interceptor';
import {fakeBackendProvider} from '../fake-backend/fake-backend';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PagesModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider
  ]
})
export class AppModule { }
