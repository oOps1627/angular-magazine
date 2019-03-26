import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { Product } from '../app/core/models/product.model';
import { User } from '../app/core/models/user.model';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // array in local storage for registered user
    let users: User[] = JSON.parse(localStorage.getItem('users')) || [];

    const products: Product[] = [
      {title: 'Samsung S8', id: '1', price: 23000, imagePath: 'assets/images/samsung_s8.jpg', manufacturer: 'Samsung', camera: '15', rating: 4.5, numberOfVotes: 6},
      {title: 'Xiaomi Redmi 4x', id: '2', price: 4300, imagePath: 'assets/images/meizu_redmi_4x.jpg', manufacturer: 'Xiaomi', camera: '13', rating: 4.5, numberOfVotes: 6},
      {title: 'Iphone X', id: '3', price: 26000, imagePath: 'assets/images/iphone_x.jpg', manufacturer: 'Iphone', camera: '15', rating: 4.5, numberOfVotes: 6},
      {title: 'Nokia Lumia 720D', id: '4', price: 8700, imagePath: 'assets/images/nokia_lumia.jpg', manufacturer: 'Nokia', camera: '12', rating: 4.5, numberOfVotes: 6},
      {title: 'Huawei Y80', id: '5', price: 4500, imagePath: 'assets/images/Huawei_Y80.jpg', manufacturer: 'Huawei', camera: '15', rating: 4.5, numberOfVotes: 6},
      {title: 'Meizu M2 Note', id: '6', price: 2500, imagePath: 'assets/images/meizu_m2_note.jpg', manufacturer: 'Meizu', camera: '13', rating: 4.3, numberOfVotes: 6},
      {title: 'Nokia A56', id: '7', price: 6500, imagePath: 'assets/images/Nokia_A56.jpg', manufacturer: 'Nokia', camera: '11', rating: 4.2, numberOfVotes: 6},
      {title: 'Fly IQ4313', id: '8', price: 2300, imagePath: 'assets/images/nopicture.gif', manufacturer: 'Fly', camera: '8', rating: 4.5, numberOfVotes: 5},
      {title: 'Huawei Y50', id: '9', price: 12500, imagePath: 'assets/images/Huawei_Y50.jpg', manufacturer: 'Huawei', camera: '15', rating: 4.7, numberOfVotes: 6},
      {title: 'Meizu M3 Note', id: '10', price: 3500, imagePath: 'assets/images/nopicture.gif', manufacturer: 'Meizu', camera: '13', rating: 4.5, numberOfVotes: 7},
      {title: 'Nokia 6.1', id: '11', price: 14300, imagePath: 'assets/images/nokia_6.1.jpg', manufacturer: 'Nokia', camera: '15', rating: 4.5, numberOfVotes: 6},
      {title: 'Fly IQ4315', id: '12', price: 2500, imagePath: 'assets/images/fly_4315.jpg', manufacturer: 'Fly', camera: '9', rating: 4.4, numberOfVotes: 2}
      ];

    let currentFilteredProducts: Product[] = products;

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      // GET PRODUCT BY ID
      if (request.url.match(/api\/products\/\d+$/) && request.method === 'GET') {
        // find user by id in user array
        let urlParts = request.url.split('/');
        let id = urlParts[urlParts.length - 1];
        let matchedProducts = products.filter(prod => prod.id === id);
        let product = matchedProducts.length ? matchedProducts[0] : null;
        if (product) {
          return of(new HttpResponse({status: 200, body: JSON.stringify(product)}));
        } else {
          return of(new HttpResponse({status: 404, statusText: 'URL not Found'}));
        }
      }

      // GET COLLECTION PRODUCTS
      if (request.url.endsWith('api/products/collect') && request.method === 'GET') {
        let filteredProducts = products;
        const prices = +request.params.get('price-range').split('-');
        console.log('we');
        const ltePrice = +request.params.get('price[lte]');
        const gtePrice = +request.params.get('price[gte]');
        const manufacturer = request.params.getAll('manufacturer');
        const camera = request.params.getAll('camera');
        const page = +request.params.get('page');
        const limit = +request.params.get('limit');
        const order = request.params.get('order');
        if (ltePrice && gtePrice) {
          filteredProducts = filteredProducts.filter(product => {
            return product.price >= ltePrice && product.price <= gtePrice;
          });
        }
        if (manufacturer) {
          filteredProducts = filteredProducts.filter(product => {
            let index = manufacturer.indexOf(product.manufacturer);
            if (index !== -1) return product;
          });
        }
        if (camera) {
          filteredProducts = filteredProducts.filter(product => {
            let index = camera.indexOf(product.camera);
            if (index !== -1) return product;
          });
        }
        filteredProducts = this.sortProducts(order, filteredProducts);
        currentFilteredProducts = filteredProducts;
        let count = filteredProducts.length;
        filteredProducts = this.getProductsInPage(page, limit, filteredProducts);
        let body = JSON.stringify({
          data: filteredProducts,
          meta: {total: count}
        });
        return of(new HttpResponse({
          status: 200,
          body: body
        }));
      }

      // SEARCH PRODUCTS
      if (request.url.endsWith('api/products/search') && request.method === 'GET') {
        const page = +request.params.get('page');
        const limit = +request.params.get('limit');
        const order = request.params.get('order');
        const term = request.params.get('q').toLowerCase();
        let foundProducts = products.filter((product) => product.title.toLowerCase().includes(term));
        foundProducts = this.sortProducts(order, foundProducts);
        currentFilteredProducts = foundProducts;
        foundProducts = this.getProductsInPage(page, limit, foundProducts);

        let body = JSON.stringify({
          data: foundProducts
        });
        return of(new HttpResponse({
          status: 200,
          body: body
        }));
      }

      // SORT PRODUCTS
      if (request.url.endsWith('api/products/sort') && request.method === 'GET') {
        const page = +request.params.get('page');
        const limit = +request.params.get('limit');
        const order = request.params.get('order');
        let sortedProducts = currentFilteredProducts;
        sortedProducts = this.sortProducts(order, sortedProducts);
        sortedProducts = this.getProductsInPage(page, limit, sortedProducts);

        let body = JSON.stringify({
          data: sortedProducts
        });
        return of(new HttpResponse({
          status: 200,
          body: body
        }));
      }

      // GET FILTER OPTIONS
      if (request.url.endsWith('api/products/filter-options') && request.method === 'GET') {
        const prices: number[] = [];
        products.forEach(product => {
          prices.push(product.price);
        });
        const minPrice = Math.min.apply(null, prices);
        const maxPrice = Math.max.apply(null, prices);
        let options = [
          {type: 'slider', property: 'price', value: {lte: minPrice, gte: maxPrice}},
          {type: 'checkbox', property: 'manufacturer', value: ['Xiaomi', 'Samsung', 'Iphone', 'Nokia', 'Huawei', 'Fly', 'Meizu']},
          {type: 'checkbox', property: 'camera', value: ['8', '11', '12', '13', '15']}
        ];

        let body = JSON.stringify({
          data: options
        });
        return of(new HttpResponse({
          status: 200,
          body: body
        }));
      }

      // ***** USERS *******

      // REGISTER
      if (request.url.endsWith('api/user/register') && request.method === 'POST') {
        console.log('WORK!');
        // get new user object from post body
        let newUser: User = request.body;

        let duplicateUser = users.filter(user => user.username === newUser.username).length;
        if (duplicateUser) {
          return throwError({error: {message: 'Username "' + newUser.username + '" is already taken'}});
        }
        newUser.id = users.length + 1 + '';
        newUser.basket = [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        return of(new HttpResponse({status: 200}));
      }

      // AUTH
      if (request.url.endsWith('api/user/login') && request.method === 'POST') {
        let filteredUsers: User[] = users.filter(user => {
          return user.username === request.body.username && user.password === request.body.password;
        });

        if (filteredUsers.length) {
          let user = filteredUsers[0];

          let body = JSON.stringify({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            token: user.id // fake token
          });
          return of(new HttpResponse({
            status: 200,
            body: body
          }));
        } else {
          return throwError({error: {message: 'Username or password is incorrect'}});
        }
      }

      // GET BASKET
      if (request.url.endsWith('api/user/basket') && request.method === 'GET') {
        const userId = request.headers.get('Authorization');
        const currentUser = users.find(user => user.id === userId);

        return of(new HttpResponse({
          status: 200,
          body: JSON.stringify(currentUser.basket)
        }));
      }

      // ADD TO BASKET
      if (request.url.endsWith('api/user/basket') && request.method === 'POST') {
        const productId = request.body.productId;
        const amount = request.body.amount;
        const userId = request.headers.get('Authorization');

        const currentUser = users.find(user => user.id === userId);
        const selectedProduct = products.find(product => product.id === productId);
        currentUser.basket.push({
          product: selectedProduct,
          amount: amount
        });
        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(users)); // update local storage
        return of(new HttpResponse({status: 200}));
      }

      // DELETE FROM BASKET
      if (request.url.endsWith('api/user/basket') && request.method === 'DELETE') {
        const productId = request.params.get('productId');
        const userId = request.headers.get('Authorization');

        const currentUser = users.find(user => user.id === userId);
        const selectedProduct = currentUser.basket.find(item => item.product.id === productId);
        const index = currentUser.basket.indexOf(selectedProduct);
        currentUser.basket.splice(index, 1);
        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(users)); // update local storage
        return of(new HttpResponse({
          status: 200,
          body: JSON.stringify(currentUser.basket)
        }));
      }

      // pass through any requests not handled above
      return next.handle(request);

    }))

    // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }

  sortProducts(order: string, products: Product[]): Product[] {
    let sortedProducts: Product[] = [];
    if (order[order.length - 1] === '-') {
      order = order.slice(0, -1);
      sortedProducts = products.sort((a, b) => a[order] < b[order] ? 1 : a[order] === b[order] ? 0 : -1);
    } else {
      sortedProducts = products.sort((a, b) => a[order] > b[order] ? 1 : a[order] === b[order] ? 0 : -1);
    }
    return sortedProducts;
  }

  getProductsInPage(page: number, limit: number, products: Product[]): Product[] {
    return products.filter((product, i) => {
      let start = (page - 1) * limit;
      let end = start + limit;
      if (i >= start && i < end) return product;
    });
  }

}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
