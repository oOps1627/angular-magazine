import { NgModule } from '@angular/core';

import {
  MatToolbarModule,
  MatButtonModule,
  MatExpansionModule,
} from '@angular/material';
import { AppRoutingModule } from '../../app.routing.module';

import { HeaderComponent } from './header/header.component';
import {BrowserModule} from '@angular/platform-browser';
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Angular Material
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    ],
  declarations: [
    HeaderComponent
    ],
  exports: [
    HeaderComponent
  ]
})
export class ComponentsModule {
}
