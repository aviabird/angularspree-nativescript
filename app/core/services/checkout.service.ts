import { map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CheckoutActions } from './../../checkout/actions/checkout.actions';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { LineItem } from './../models/line_item';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { Order } from '../models/order';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class CheckoutService {
  /**
   *Creates an instance of CheckoutService.
   * @param {HttpClient} http
   * @param {CheckoutActions} actions
   * @param {Store<State>} store
   * @param {ToastrService} toastyService
   * @param {*} platformId
   * @memberof CheckoutService
   */
  constructor(
    private http: HttpClient,
    private actions: CheckoutActions,
    private store: Store<State>,

    @Inject(PLATFORM_ID) private platformId: Object) {
  }

  /**
   *
   *
   * @param {number} variant_id
   * @returns
   *
   * @memberof CheckoutService
   */
  createNewLineItem(variant_id: number, quantity: number): Observable<LineItem> {

    if (!this.getOrderToken()) {
      const order_params = { order: { line_items: { 0: { variant_id: variant_id, quantity: quantity } } } };
      return this.createNewOrder(order_params).pipe(map(order => order.line_items[0]));
    }

    const params = {
      line_item: { variant_id: variant_id, quantity: quantity }
    };
    const url = `api/v1/orders/${this.orderNumber()}/line_items?order_token=${this.getOrderToken()}`;
    return this.http.post<LineItem>(url, params).pipe(
      tap(
        lineItem => {

          return lineItem;
        },
        _ => {
          localStorage.removeItem('order');
          this.createNewLineItem(variant_id, quantity).subscribe();
        }
      )
    );
  }

  createNewOrder(orderParams): Observable<Order> {
    const new_order_url = `api/v1/orders`;
    return this.http.post<Order>(new_order_url, orderParams).pipe(
      tap(
        order => {
          this.setOrderTokenInLocalStorage({ order_token: order.token, order_number: order.number });
          this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
        },

      )
    );
  }

  fetchCurrentOrder() {
    return this.http.get<Order>('api/v1/orders/current').pipe(
      switchMap(order => {
        if (order) {
          return of(order);
        } else {
          if (this.getOrderToken()) {
            const s_order = JSON.parse(localStorage.getItem('order'));
            return this.getOrder(s_order.order_number);
          } else {
            return of(null);
          }
        }
      }),
      map(order => {
        if (!order) {
          localStorage.removeItem('order');
          return;
        }
        const { token, number } = order;
        this.setOrderTokenInLocalStorage({ order_token: token, order_number: number });
        return this.store.dispatch(this.actions.fetchCurrentOrderSuccess(order));
      })
    );
  }

  /**
   *
   *
   * @param {string} orderNumber
   * @returns
   * @memberof CheckoutService
   */
  getOrder(orderNumber: string) {
    const url = `api/v1/orders/${orderNumber}?order_token=${this.getOrderToken()}`;
    return this.http.get<Order>(url);
  }

  removeLocalOrder() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('order');
    }
  }

  createEmptyOrder() {
    return this.http.post<Order>(`api/v1/orders`, { order: {} });
  }

  /**
   *
   *
   * @param {LineItem} lineItem
   * @returns
   *
   * @memberof CheckoutService
   */
  deleteLineItem(lineItem: LineItem) {
    const url = `api/v1/orders/${this.orderNumber()}/line_items/${
      lineItem.id
      }?order_token=${this.getOrderToken()}`;
    return this.http.delete(url).pipe(map(_ => lineItem));
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  changeOrderState() {
    const url = `api/v1/checkouts/${
      this.orderNumber()
      }/next.json?order_token=${this.getOrderToken()}`;
    return this.http
      .put<Order>(url, {})
      .pipe(
        map(order =>
          this.store.dispatch(this.actions.changeOrderStateSuccess(order))
        )
      );
  }

  /**
   *
   *
   * @param {any} params
   * @returns
   *
   * @memberof CheckoutService
   */
  updateOrder(params: any) {
    const url = `api/v1/checkouts/${
      this.orderNumber()
      }.json?order_token=${this.getOrderToken()}`;
    return this.http
      .put<Order>(url, params)
      .pipe(
        map(order =>
          this.store.dispatch(this.actions.updateOrderSuccess(order))
        )
      );
  }

  /**
   *
   *
   * @returns
   *
   * @memberof CheckoutService
   */
  availablePaymentMethods() {
    const url = `api/v1/orders/${
      this.orderNumber()
      }/payments/new?order_token=${this.getOrderToken()}`;
    return this.http.get<any>(url);
  }

  /**
   *
   *
   * @param {number} paymentModeId
   * @param {number} paymentAmount
   * @returns
   * @memberof CheckoutService
   */
  createNewPayment(paymentModeId: number, paymentAmount: number) {
    return this.http
      .post(
        `api/v1/orders/${
        this.orderNumber()
        }/payments?order_token=${this.getOrderToken()}`,
        {
          payment: {
            payment_method_id: paymentModeId,
            amount: paymentAmount
          }
        }
      )
      .pipe(map(_ => this.changeOrderState().subscribe()));
  }


  /**
   *
   *
   * @private
   * @returns
   *
   * @memberof CheckoutService
   */
  getOrderToken() {
    const order = JSON.parse(localStorage.getItem('order'));
    return order ? order.order_token : null;
  }

  orderNumber() {
    const order = isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem('order')) : {};
    return order ? order.order_number : null;
  }

  shipmentAvailability(pincode: number): Observable<{ available: boolean }> {
    return this.http
      .post<{ available: boolean }>(`address/shipment_availability`, { pincode: pincode });
  }
  /**
   *
   *
   * @private
   * @param {any} token
   *
   * @memberof CheckoutService
   */
  setOrderTokenInLocalStorage(token: any): void {
    const jsonData = JSON.stringify(token);
    localStorage.setItem('order', jsonData);

  }
}
