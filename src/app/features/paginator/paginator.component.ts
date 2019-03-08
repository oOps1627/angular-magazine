import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: 'paginator.component.html',
  styleUrls: ['paginator.component.scss']
})
export class PaginatorComponent {
  @Input() perPage = 10;
  @Input() pagesToShow = 5;
  @Input() page: number;
  @Input() totalItems: number;
  @Output() pageChange = new EventEmitter<number>();

  constructor() {}

  getPages(): number[] {
    let numberOfPages = Math.ceil(this.totalItems / this.perPage);
    let pages = [];
    pages.push(this.page);
    for (let i = 0; i < this.pagesToShow - 1; i++) {
      if (pages.length < this.pagesToShow) {
        let min = Math.min.apply(null, pages);
        if (min > 1) {
          pages.push(min - 1);
        }
      }
      if (pages.length < this.pagesToShow) {
        let max = Math.max.apply(null, pages);
        if (max < numberOfPages) {
          pages.push(max + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }

  goToPage(page) {
    this.page = page;
    this.pageChange.emit(page);
  }

  goPrev() {
    this.page--;
    this.pageChange.emit(this.page);
  }

  goNext() {
    this.page++;
    this.pageChange.emit(this.page);
  }

  goTop() {
    this.page = 1;
    this.pageChange.emit(this.page);
  }

  goEnd() {
    this.page = Math.ceil(this.totalItems / this.perPage);
    this.pageChange.emit(this.page);
  }

  checkIsLastPage() {
    return this.page * this.perPage >= this.totalItems;
  }
}
