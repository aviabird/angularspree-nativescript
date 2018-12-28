import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgShadowModule } from "nativescript-ngx-shadow";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { ProductActions } from "~/product/actions/product-actions";
import { ProductEffects } from "~/product/effects/product.effects";
import { SearchActions } from "~/search/action/search.actions";
import { SearchEffects } from "~/search/effects/search.effects";
import { SharedModule } from "~/shared/shared.module";
import { CategoryMenuComponent } from "./components/category-menu/category-menu.component";
import { SearchBoxComponent } from "./components/search-box/search-box.component";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
@NgModule({
  imports: [
    NativeScriptCommonModule,
    HomeRoutingModule,
    NativeScriptCommonModule,
    NativeScriptUIListViewModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    EffectsModule.forRoot([ProductEffects, SearchEffects]),
    SharedModule,
    NgShadowModule
  ],
  declarations: [
    HomeComponent,
    SearchBoxComponent,
    CategoryMenuComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
  providers: [
    ProductActions,
    SearchActions
  ]
})
export class HomeModule { }
