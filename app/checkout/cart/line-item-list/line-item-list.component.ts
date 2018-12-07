import { Component, Input, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { RouterExtensions } from "nativescript-angular/router";
import { Observable } from "rxjs";
import { getLineItems } from "~/checkout/reducers/selectors";
import { LineItem } from "~/core/models/line_item";
import { IappState } from "~/app.reducers";

@Component({
  moduleId: module.id,
  selector: "line-item-list",
  templateUrl: "./line-item-list.component.html",
  styleUrls: ["./line-item-list.component.scss"]
})

export class LineItemListComponent implements OnInit {
  @Input() itemTotal: number;
  lineItems$: Observable<Array<LineItem>>;

  constructor(
    private store: Store<IappState>,
    private router: RouterExtensions
  ) {
    this.lineItems$ = this.store.select(getLineItems);
  }

  ngOnInit() {
    //
  }

  onBack() {
    this.router.backToPreviousPage();
  }
}
