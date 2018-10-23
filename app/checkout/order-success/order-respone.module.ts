import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { SharedModule } from "~/shared/shared.module";
import { OrderResponeComponent } from "./order-respone.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        SharedModule
    ],
    declarations: [
        OrderResponeComponent
    ],

    providers: [

    ]
    ,
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class OrderModule { }