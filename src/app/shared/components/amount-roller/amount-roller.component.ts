import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-amount-roller',
  templateUrl: 'amount-roller.component.html',
  styleUrls: ['amount-roller.component.scss']
})
export class AmountRollerComponent {
  @Input() amount = 1;
  @Output() amountChange = new EventEmitter<number>();
  constructor() {}

  increaseAmount() {
    this.amount++;
    this.amountChange.emit(this.amount);
  }

  reduceAmount() {
    if (this.amount > 1) {
      this.amount--;
      this.amountChange.emit(this.amount);
    }
  }
}
