import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ProductsModule,
    UserModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    NotFoundComponent
  ],
  exports: [
  ]
})
export class PagesModule {
}
