import { Component } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';

import * as app from "application";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { SearchBar } from "ui/search-bar";

import { TextField } from "ui/text-field";
@Component({
    selector: "sb-component",
    moduleId: module.id,
    templateUrl: "./searchbar-component.html",
    styleUrls: ["./searchbar-component.scss"]

})
export class SearchBarComponent {
    searchPhrase: string;
    searchBar;
    constructor(private router: Router) {

    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    onTextChanged(args) {
        this.searchBar = <SearchBar>args.object;
        console.log("SearchBar text changed! New value: " + this.searchBar.text);
    }
    onSubmit(args) {
        this.searchBar = <SearchBar>args.object;
        // alert("You are searching for " + this.searchBar.text);
        this.router.navigate(["/search"]);
    }

}
