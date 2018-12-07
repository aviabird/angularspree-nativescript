import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "~/shared/shared.module";
import { CheckoutActions } from "./actions/checkout.actions";
import { AddressModule } from "./address/address.module";
import { CartModule } from "./cart/cart.module";
import { routes } from "./checkout.routes";
import { OrderModule } from "./order-success/order-response.module";
import { PaymentModule } from "./payment/payment.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CartModule,
    SharedModule,
    AddressModule,
    OrderModule,
    PaymentModule
  ],
  declarations: [
  ],
  providers: [
    CheckoutActions
  ]
})
export class CheckoutModule { }
