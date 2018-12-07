import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Observable } from "rxjs";
import { Product } from "../core/models/product";
import { ProductService } from "../core/services/product.service";
import { ProductActions } from "../product/actions/product-actions";
import { IappState } from "../reducers";
import { SearchActions } from "./action/search.actions";
import { getProductsByKeyword } from "./reducers/selectors";

@Component({
  selector: "Search",
  moduleId: module.id,
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"]
})

export class SearchComponent implements OnInit {
  products: Object;
  products1: Object;
  page: number;
  upadatedstring: string;
  queryParams: Params;
  productCount: number;
  myItems: Array<string> = [];
  counter = 1;
  products$: Observable<Product>;
  constructor(
    private routernomal: Router,
    private activeRoute: ActivatedRoute,
    private store: Store<IappState>,
    private actions: ProductActions,
    private searchActions: SearchActions) {
    this.store.dispatch(this.actions.getAllProducts(1));
    this.store.dispatch(this.actions.getAllTaxonomies());
    this.products$ = this.store.select(getProductsByKeyword);
    this.store.select(getProductsByKeyword).subscribe((productdata) => {
      this.products = productdata;
      this.productCount = this.productCount;
    });
    this.activeRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
    });

  }

  ngOnInit() { }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  queryMap = {
    Newest: "updated_at+asc",
    "Avg.Customer Review": "avg_rating+desc",
    "Most Reviews": "reviews_count+desc",
    "A To Z": "name+asc",
    "Z To A": "name+desc",
    Relevance: ""
  };
  seltected = "Z To A";
  sortFilter(i) {
    const urlTree = this.routernomal.createUrlTree([], {
      queryParams: { "q[s]": this.queryMap[i] },
      queryParamsHandling: "merge",
      preserveFragment: true
    });

  }

  loadMoreItems() {
    this.page = this.counter + 1;
    this.upadatedstring = this.queryParams["q[name_cont_any]"] + `&page=${this.page}`;
    this.store.dispatch(
      this.searchActions.getproductsByKeyword(this.upadatedstring)
    );
  }
}
