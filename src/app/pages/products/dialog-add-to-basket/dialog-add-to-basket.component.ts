import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-dialog-add-to-basket',
  templateUrl: 'dialog-add-to-basket.component.html',
  styleUrls: ['dialog-add-to-basket.component.scss']
})
export class DialogAddToBasketComponent {
  amount = 1;

  constructor(
    public dialogRef: MatDialogRef<DialogAddToBasketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) {}

  increaseAmount() {
    this.amount++;
  }

  reduceAmount() {
    if (this.amount > 1) {
      this.amount--;
    }
  }
  onClose(): void {
    this.dialogRef.close();
  }
  addToBasket(): void {
    this.dialogRef.close();
  }
}
