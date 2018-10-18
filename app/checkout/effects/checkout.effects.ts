import { Action } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { LineItem } from './../../core/models/line_item';
import { CheckoutService } from '../../core/services/checkout.service';
import { CheckoutActions } from './../actions/checkout.actions';
import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';

@Injectable()
export class CheckoutEffects {
  @Effect()
  AddToCart$ = this.actions$
    .ofType(CheckoutActions.ADD_TO_CART).pipe(
      switchMap<Action & {payload: {variant_id: number, quantity: number}}, LineItem>(action => {
        return this.checkoutService.createNewLineItem(
          action.payload.variant_id,
          action.payload.quantity
        );
      }),
      map(lineItem => this.actions.addToCartSuccess(lineItem))
    );

  @Effect()
    RemoveLineItem$ = this.actions$
    .ofType(CheckoutActions.REMOVE_LINE_ITEM)
    .pipe(
      switchMap<Action & {payload: LineItem}, LineItem>(action => {
        return this.checkoutService.deleteLineItem(action.payload);
      }),
      map(lineItem => this.actions.removeLineItemSuccess(lineItem))
    )

  constructor(
    private actions$: Actions,
    private checkoutService: CheckoutService,
    private actions: CheckoutActions
  ) { }
}
// @Effect()
// FetchCurrentOrder$ = this.actions$
// .ofType(CartActions.FETCH_CURRENT_ORDER)
// .switchMap(action => {
//   return this.cartService.fetchCurrentOrder();
// })
// .map((order: Order) => {
//   return this.cartActions.fetchCurrentOrderSuccess(order);
// });

// Use this effect once angular releases RC4

