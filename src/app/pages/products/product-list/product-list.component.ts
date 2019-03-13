import {Component, OnInit} from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { FilterOptions } from '../../../core/models/filter-options.model';
import { MatDialog } from '@angular/material';
import { DialogAddToBasketComponent } from '../dialog-add-to-basket/dialog-add-to-basket.component';

class SortOption {
  title: string;
  order: string;
}
const options: SortOption[] = [
  { title: 'From cheap to expensive',  order: 'price' },
  { title: 'From expensive to cheap',  order: 'price-' },
  { title: 'Sort by name',  order: 'title' },
];

@Component({
  selector: 'app-product-list',
  templateUrl: 'product-list.component.html',
  styleUrls: ['product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  limit = 8;
  page = 1;
  products: Product[];
  loading = true;
  sortOptions: SortOption[] = options;
  selectedSortOption: SortOption = this.sortOptions[0];
  order = this.selectedSortOption.order;
  constructor (private productService: ProductService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getProducts(this.page, this.limit, this.order);
  }

  getProducts(page: number, limit: number, order: string, filterOptions?: FilterOptions): void {
    this.loading = true;
    this.productService.getProducts(page, limit, order, filterOptions).subscribe(products => {
      this.updateProducts(products);
    });
  }

  switchPage(selectedFilterOptions: FilterOptions) {
    this.getProducts(this.page, this.limit, this.order, selectedFilterOptions);
  }

  sortProducts(order: string) {
    this.loading = true;
    this.order = order;
    this.productService.sortProducts(this.page, this.limit, order).subscribe( products => {
      this.updateProducts(products);
      }
    );
  }

  updateProducts(products: Product[]): void {
    this.products = products;
    this.loading = false;
  }

  switchLoading(loading): void {
    this.loading = loading;
  }

  openDialogAddToBasket(product): void {
    const dialogRef = this.dialog.open(DialogAddToBasketComponent, {
      data: product
    });
  }
}
