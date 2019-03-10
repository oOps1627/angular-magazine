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
    const numberOfPages = Math.ceil(this.totalItems / this.perPage);
    const pages = [];
    pages.push(this.page);
    for (let i = 0; i < this.pagesToShow - 1; i++) {
      if (pages.length < this.pagesToShow) {
        const min = Math.min.apply(null, pages);
        if (min > 1) {
          pages.push(min - 1);
        }
      }
      if (pages.length < this.pagesToShow) {
        const max = Math.max.apply(null, pages);
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
    this.emitChange();
  }

  goPrev() {
    this.page--;
    this.emitChange();
  }

  goNext() {
    this.page++;
    this.emitChange();
  }

  goTop() {
    this.page = 1;
    this.emitChange();
  }

  goEnd() {
    this.page = Math.ceil(this.totalItems / this.perPage);
    this.emitChange();
  }

  checkIsLastPage() {
    return this.page * this.perPage >= this.totalItems;
  }

  private emitChange() {
    this.pageChange.emit(this.page);
  }
}
