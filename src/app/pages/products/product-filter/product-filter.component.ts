import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterOptions, Checkbox, SliderPropertyList} from '../shared/filter-options.model';
import {ProductService} from '../shared/product.service';
import {Product} from '../shared/product.model';

import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, startWith, switchMap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  templateUrl: 'product-filter.component.html',
  styleUrls: ['product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  @Output() updateProducts = new EventEmitter<Product[]>(); // send new products to ProductListComponent
  @Output() switchProductsLoading = new EventEmitter<boolean>(); // for switch loading icon in ProductListComponent
  @Input() page: number;
  @Input() limit: number;
  @Input() order: string;
  loading = true;
  searchControl = new FormControl();
  selectedFilterOptions = new FilterOptions();
  receivedFilterOptions = new FilterOptions(); // all options which needs for init filter
  currentSlidersValues = new SliderPropertyList();
  foundProducts: Observable<Product[]>;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.initFilter();
    this.foundProducts = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.productService.searchProducts(this.page, this.limit, this.order, term))
    );
  }

  initFilter(): void {
    this.productService.getFilterOptions().subscribe(options => {
      options.forEach((option) => {
        switch (option.type) {
          case 'slider': {
            this.receivedFilterOptions.sliders[option.property].setValues(option.value.lte, option.value.gte);
            this.currentSlidersValues[option.property].setValues(option.value.lte, option.value.gte);
            break;
          }
          case 'checkbox': {
            option.value.forEach((name) => {
              this.receivedFilterOptions.checkboxes[option.property].push(new Checkbox(name));
            });
          }
        }
      });
      this.loading = false;
    });
  }

  getProducts(page: number, limit: number, order: string, options?: FilterOptions): void {
    this.switchProductsLoading.emit(true);
    this.productService.getProducts(page, limit, order, options).subscribe(products => {
      this.updateProducts.emit(products);
    });
  }

  onSliderChange(property: string, selectedValues: number[]): void {
    this.currentSlidersValues[property].setValues(selectedValues[0], selectedValues[1]);
  }

  search() {
    this.switchProductsLoading.emit(true);
    this.productService.searchProducts(this.page, this.limit, this.order, this.searchControl.value).subscribe((products) => {
      this.updateProducts.emit(products);
    });
  }

  onFilter(): void {
    // iterate all selected sliders
    for (const propName in this.selectedFilterOptions.sliders) {
      if (this.selectedFilterOptions.sliders.hasOwnProperty(propName)) {
        // assign a value to selectedFilterOptions if it is not primary
        if (this.currentSlidersValues[propName].checkValues(this.receivedFilterOptions.sliders[propName])) {
          this.selectedFilterOptions.sliders[propName]
            .setValues(this.currentSlidersValues[propName].lte, this.currentSlidersValues[propName].gte);
        }
      }
    }
    // iterate all selected checkboxes
    for (const propName in this.receivedFilterOptions.checkboxes) {
      if (this.receivedFilterOptions.checkboxes.hasOwnProperty(propName)) {
        this.selectedFilterOptions.checkboxes[propName] = this.receivedFilterOptions.checkboxes[propName].filter((checkbox) => {
          return checkbox.checked === true;
        });
      }
    }
    this.getProducts(this.page, this.limit, this.order, this.selectedFilterOptions);
  }

  deleteTag(type: string, propName: string, elem?): void {
    if (type === 'slider') {
      const receivedProperty = this.receivedFilterOptions.sliders[propName];
      this.currentSlidersValues[propName].setValues(receivedProperty.lte, receivedProperty.gte);  // set starting values on slider
      this.selectedFilterOptions.sliders[propName].setValues(0, 0); // zeroing values (when choose nothing)
    } else if (type === 'checkbox') {
      const index = this.selectedFilterOptions.checkboxes[propName].indexOf(elem);
      this.selectedFilterOptions.checkboxes[propName].splice(index, 1);
      this.receivedFilterOptions.checkboxes[propName].find((checkbox) => checkbox.name === elem.name).checked = false;

    }
    this.getProducts(this.page, this.limit, this.order, this.selectedFilterOptions);
  }

}
