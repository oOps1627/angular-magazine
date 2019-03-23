import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/user.service';

@Component({
  selector: 'app-user-basket',
  templateUrl: 'user-basket.component.html',
  styleUrls: ['user-basket.component.scss']
})
export class UserBasketComponent implements OnInit {
  basket: any[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getBasket().subscribe(basket => {
      this.basket = basket;
    });
  }

  getTotalAmount(): number {
    let totalAmount = 0;
    this.basket.forEach(item => {
      totalAmount += item.product.price * item.amount;
    });
    return totalAmount;
  }

  deleteProduct(productId: string): void {
    this.userService.deleteFromBasket(productId).subscribe((newBasket) => {
      this.basket = newBasket;
    });
  }
}

