import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable as RxObservable } from "rxjs";

@Injectable()
export class ProductService {

    constructor(private http: HttpClient) { }

    getProducts(pageNumber: 1) {
        return this.http.get(`http://18.222.218.152/api/v1/products?page=${pageNumber}&per_page=20`);
    }
    getProductDetail(id: string) {
        return this.http.get(`http://18.222.218.152/api/v1/products/${id}?data_set=large`);
    }

}
