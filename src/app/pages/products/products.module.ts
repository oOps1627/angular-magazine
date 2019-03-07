import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductsComponent } from './products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ComponentsModule } from '../../shared/components/components.module';

import {fakeBackendProvider} from '../../../fake-backend/fake-backend';
// Material
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatSidenavModule,
  MatToolbarModule,
  MatChipsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,
  MatInputModule,
  MatTabsModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { NpnSliderModule } from 'npn-slider';
import { PaginatorComponent } from '../../features/paginator/paginator.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    NpnSliderModule,
    FormsModule,
    MatToolbarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    ProductsRoutingModule,
    ComponentsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
  ],
  declarations: [
    ProductsComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductFilterComponent,

    PaginatorComponent
  ],
  exports: [
    ProductsComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ProductFilterComponent
  ],
  providers: [
    fakeBackendProvider
  ]
})
export class ProductsModule {
}
