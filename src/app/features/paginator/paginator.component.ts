import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: 'paginator.component.html',
  styleUrls: ['paginator.component.scss']
})
export class PaginatorComponent {
  @Input() page: number;
  @Input() perPage: number;
  @Input() totalItems: number;
  @Input() pagesToShow: number;
  @Output() pageChange = new EventEmitter<number>();

  constructor() {}

  getPages(): number[] {
    return [1, 2, 3, 4];
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
}
