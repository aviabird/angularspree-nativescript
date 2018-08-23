import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { isAndroid } from "platform";
import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { SearchBar } from "ui/search-bar";
import { TextField } from "ui/text-field";
import { ProductService } from "~/core/services/product.service";
import { URLSearchParams } from '@angular/http';
import { State } from "~/reducers";
import { Store } from "@ngrx/store";
import { SearchActions } from "../../search/action/search.actions";
@Component({
  selector: "sb-component",
  moduleId: module.id,
  templateUrl: "./searchbar-component.html",
  styleUrls: ["./searchbar-component.scss"]

})

export class SearchBarComponent {
  searchPhrase: string;
  searchBar;
  routernomal: any;
  queryParams: any;
  constructor(private router: Router, private myService: ProductService, private store: Store<State>,
    private searchActions: SearchActions) {

  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  onTextChanged(args) {
    this.searchBar = <SearchBar>args.object;

  }

  public sBLoaded(args) {
    var searchbar: SearchBar = <SearchBar>args.object;
    if (isAndroid) {
      searchbar.android.clearFocus();
    }
  }

  onSubmit(args) {
    this.searchBar = <SearchBar>args.object;
    const search = new URLSearchParams();
    search.set('q[name_cont_any]', this.searchBar.text);
    this.store.dispatch(
      this.searchActions.getproductsByKeyword(search.toString())
    );
    this.router.navigate(['/search'], {
      queryParams: {
        'q[name_cont_any]': search.toString(),
      }
    });
    this.searchBar.dismissSoftInput();
  }
}
