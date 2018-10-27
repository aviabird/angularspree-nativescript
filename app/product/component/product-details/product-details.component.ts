import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { RouterExtensions } from "nativescript-angular/router";
import { Observable, Subscription } from "rxjs";
import { Product } from "~/core/models/product";
import { Variant } from "~/core/models/variant";
import { ProductService } from "~/core/services/product.service";
import { VariantParserService } from "~/core/services/variant-parser.service";
import { VariantRetriverService } from "~/core/services/variant-retriver.service";
import { IappState } from "~/home/reducers";
import { SearchActions } from "~/search/action/search.actions";
import { getProductsByKeyword } from "~/search/reducers/selectors";
import { CheckoutActions } from '~/checkout/actions/checkout.actions';

@Component({
  moduleId: module.id,
  selector: "product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"]
})

export class ProductDetailsComponent implements OnInit {

  productSlug: any;
  subscriptionList$: Array<Subscription> = [];
  product: Product;
  masterProductId: number;
  variantId: number;
  productImageUrl: string;
  productMRP: string;
  productPrice: string;
  productDiscount: number;
  discountPercent: string;
  isProductOderable: boolean;
  discription: string;
  similarProducts$: Observable<any>;

  // Varinats
  customOptionTypesHash: any;
  currentSelectedOptions = {};
  mainOptions: any;
  correspondingOptions: any;
  @Output() selectedVariant = new EventEmitter<object>();

  constructor(
    private store: Store<IappState>,
    private productService: ProductService,
    private activatedRouter: ActivatedRoute,
    private router: RouterExtensions,
    private searchActions: SearchActions,
    private variantParser: VariantParserService,
    private checkoutActions: CheckoutActions) { }

  ngOnInit() {
    this.subscriptionList$.push(
      this.activatedRouter.params.subscribe((params) => {
        this.productSlug = params;
        this.productService.getProduct(this.productSlug.id)
          .subscribe((product) => {
            this.product = product;
            this.initProduct();
          });
      })
    );
  }

  initProduct() {
    this.masterProductId = this.product.id;
    this.discription = this.product.description;
    this.similarProductsList(this.product);
    if (this.product.has_variants) {
      this.getvariantsInfo(this.product);
      const firstVariant: Variant = this.product.variants[0];
      this.variantsAsProduct(firstVariant);
    } else {
      this.productImageUrl = this.product.master.images[0].product_url;
      this.variantId = this.product.id;
      this.productMRP = this.product.master.cost_price;
      this.productPrice = this.product.display_price;
      this.isProductOderable = this.product.master.is_orderable;
    }
  }

  variantsAsProduct(selectedVariant: Variant) {
    this.productImageUrl = selectedVariant.images[0].product_url;
    this.variantId = selectedVariant.id;
    this.productMRP = selectedVariant.cost_price;
    this.productPrice = selectedVariant.display_price;
    this.productDiscount = this.calculateDiscount(this.productMRP, selectedVariant.price);
    this.discountPercent = `${Math.ceil(this.productDiscount / +selectedVariant.cost_price * 100)}%`;
    this.isProductOderable = selectedVariant.is_orderable;
  }

  calculateDiscount(mrp, price) {
    return Math.ceil(mrp - price);
  }

  similarProductsList(product: Product) {
    if (this.product.taxon_ids[0]) {
      this.store.dispatch(
        this.searchActions.getProductsByTaxon(this.product.taxon_ids[0])
      );
      this.similarProducts$ = this.store.select(getProductsByKeyword);
    }
  }

  showProduct(slug: string) {
    this.router.navigate(["/", slug]);
  }

  addToCart(productId: number) {
    this.store.dispatch(this.checkoutActions.addToCart(productId, 1));
  }

  onBack() {
    this.router.backToPreviousPage();
  }

  // varinats selection.
  getvariantsInfo(product) {
    this.variantId = product.master.id;
    this.customOptionTypesHash = this.variantParser
      .getOptionsToDisplay(product.variants, this.product.option_types);
    this.mainOptions = this.makeGlobalOptinTypesHash(this.customOptionTypesHash);
    this.correspondingOptions = this.mainOptions;
  }

  onOptionClick(option) {
    const result = new VariantRetriverService().getVariant(
      this.currentSelectedOptions,
      this.customOptionTypesHash,
      option,
      this.product
    );

    this.createNewCorrespondingOptions(
      result.newCorrespondingOptions,
      option.value.optionValue.option_type_name
    );

    this.currentSelectedOptions = result.newSelectedoptions;
    const newVariant: Variant = result.variant;
    this.getSelectedVariant(result.variant);
    this.variantsAsProduct(newVariant);
  }

  makeGlobalOptinTypesHash(customOptionTypes) {
    const temp = {};
    for (const key in customOptionTypes) {
      if (customOptionTypes.hasOwnProperty(key)) {
        temp[key] = Object.keys(customOptionTypes[key]);
      }
    }

    return temp;
  }

  createNewCorrespondingOptions(newOptions, optionKey) {
    for (const key in this.correspondingOptions) {
      if (this.correspondingOptions.hasOwnProperty(key) && key !== optionKey) {
        this.correspondingOptions[key] = newOptions[key];
      }
    }
  }

  getSelectedVariant(variant) {
    this.selectedVariant.emit(variant);
  }
}