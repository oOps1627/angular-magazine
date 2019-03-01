import { NgModule } from '@angular/core';
import { ProductsModule } from './products/products.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ProductsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  exports: [
    ProductsModule,
    LoginComponent,
    RegisterComponent
  ]
})
export class PagesModule {
}
