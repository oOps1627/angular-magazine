import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Product} from '../../../core/models/product.model';
import {UserService} from '../../../core/services/user.service';

@Component({
  selector: 'app-dialog-add-to-basket',
  templateUrl: 'dialog-add-to-basket.component.html',
  styleUrls: ['dialog-add-to-basket.component.scss']
})
export class DialogAddToBasketComponent {
  amount = 1;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogAddToBasketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product) {}

  onClose(): void {
    this.dialogRef.close();
  }
  addToBasket(productId: string): void {
    this.userService.addToBasket(productId, this.amount).subscribe( () => {
      console.log('done');
    });
    this.dialogRef.close();
  }
}
