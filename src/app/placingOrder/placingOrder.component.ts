import { Component, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, finalize } from 'rxjs/operators';
import { PlacingOrderService } from '@app/placingOrder/placingOrder.service';
import { Logger } from '@app/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Route, Router } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
//Query param salesman view
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

const log = new Logger('Placing Order');

const WIKI_URL = 'products/?search=';
const PARAMS = new HttpParams({
  fromObject: {
    action: 'opensearch',
    format: 'json',
    origin: '*'
  }
});

let search_result: any[] = [];

@Injectable()
export class WikipediaService {
  constructor(private http: HttpClient) {}

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http.get(WIKI_URL + term, { withCredentials: true }).pipe(
      map((response: []) => {
        const arr: string[] = [];
        // response['results'].map((a: any) => {
        //   console.log(a, 'a');
        //   arr.push(a['name']);
        // });
        search_result = response['results'];
        return search_result;
      })
    );
  }
}

@Component({
  selector: 'app-placing-order',
  templateUrl: './placingOrder.component.html',
  styleUrls: ['./placingOrder.component.scss'],
  providers: [WikipediaService]
  // encapsulation: ViewEncapsulation.None
})
export class PlacingOrderComponent implements OnInit {
  orderFromSalesman: any = null;
  version: string = environment.version;
  closeResult: string;
  currentRate: any;
  //Wiki
  model: any;
  searching = false;
  searchFailed = false;
  isLoading = true;
  error: string;
  distributor_list: any[] = [];
  order_list: any[] = [];
  order_list_final: any[] = [];
  //Rating
  rating: number;
  ratingClicked: number;
  message: string;
  modalReference: any;
  show_order_qauntity_error_index: any[] = [];
  distributor_list_order_index: any[] = [];
  product_name: string;
  total_amount_of_order = 0;

  constructor(
    private distributorService: PlacingOrderService,
    private modalService: NgbModal,
    private _service: WikipediaService,
    private _hotkeysService: HotkeysService,
    public route: Router,
    private toastr: ToastrService,
    private router: ActivatedRoute
  ) {
    // this._hotkeysService.add(
    //   new Hotkey(
    //     'command+h',
    //     (event: KeyboardEvent): boolean => {
    //       this.route.navigateByUrl('/');
    //       return false; // Prevent bubbling
    //     }
    //   )
    // );
  }

  selectedItem(productname: any) {
    this.product_name = productname['item']['name'];
    this.isLoading = true;
    this.distributorService
      .distributorList(productname['item']['slug'])
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.distributor_list = data;
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  addOrder(slug: string, orderNumber: number) {
    this.calldisableBtnFunction(slug);
    const addOrder = this.distributor_list[orderNumber];
    let cloned_order = _.cloneDeep(addOrder);
    cloned_order.quantity = 1;
    this.order_list = this.order_list.concat(cloned_order);
    this.getTotalOrderValue();
  }

  removeOrder(slug: string, orderNumber: number) {
    this.callunableBtnFunction(slug);
    const removeOrder = this.order_list.splice(orderNumber, 1);
    this.getTotalOrderValue();
    // this.distributor_list = this.distributor_list.concat(removeOrder);
  }

  calldisableBtnFunction(slug: string) {
    this.distributor_list_order_index.push(slug);
  }

  callunableBtnFunction(slug: string) {
    let index = this.distributor_list_order_index.indexOf(slug);
    if (index > -1) {
      this.distributor_list_order_index.splice(index, 1);
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this._service.search(term).pipe(
          tap(() => (this.searchFailed = false)),
          debounceTime(200),
          map((term: any) => (term === '' ? [] : term.filter((v: any) => v.name.toLowerCase()))),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  formatter = (x: { name: string }) => x.name;

  ngOnInit() {
    this.message = 'Welcome !!!!';
    this.router.queryParams
      .filter(params => params['retailer_slug'])
      .subscribe(params => {
        // console.log('params', params); // {order: "popular"}
        this.orderFromSalesman = params;
        console.log('this.orderFromSalesman', this.orderFromSalesman);
        console.log('this.orderFromSalesman.retailer_slug', this.orderFromSalesman['retailer_slug']);
      });
  }

  public openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private callAlertModal(content: any): void {
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private submitOrder(order: any): void {
    order.map((data: any) => {
      delete data['company'];
      delete data['discount'];
      data['distributor'] = data['distributor_slug'];
      data['product'] = data['product_slug'];
      delete data['mrp'];
      delete data['distributor_slug'];
      delete data['product_slug'];
      delete data['pack'];
      delete data['rate'];
      delete data['rating'];
      delete data['pack'];
      delete data['vat'];
      delete data['uuid'];
      // data['quantity'] = data['stock'];
      delete data['stock'];
    });
    this.distributorService
      .orderListPlaced(order, this.orderFromSalesman)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.product_name = '';
          this.distributor_list = [];
          this.order_list = [];
          this.distributor_list_order_index = [];
          this.message = 'Your order has been placed.';
          this.toastr.success(this.message);
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.product_name = '';
          this.distributor_list = [];
          this.order_list = [];
          this.distributor_list_order_index = [];
          this.error = error;
          this.message = 'Some error is occurred.';
          this.toastr.error(this.message);
        }
      );
  }

  private receiveMessage(accept_type: any): void {
    if (accept_type === 'Yes') {
      this.submitOrder(this.order_list);
    }
  }

  private closeAlertPopUp(): void {}

  private valueChange(order_index: number, order: any, $event: any): void {
    order.quantity = $event;
    console.log(order, 'order');
    const index = this.show_order_qauntity_error_index.indexOf(order.uuid);
    if (order.quantity > order.stock) {
      if (index === -1) {
        this.show_order_qauntity_error_index.push(order.uuid);
      }
    } else {
      this.getTotalOrderValue();
      if (index > -1) {
        this.show_order_qauntity_error_index.splice(index, 1);
      }
    }
  }

  private getTotalOrderValue(): void {
    let total = 0;
    for (let i of this.order_list) {
      total = total + i['quantity'] * i['selling_price'];
    }
    this.total_amount_of_order = total;
  }

  private findExceedOrder(val: number): boolean {
    console.log('val', val);
    const index = this.show_order_qauntity_error_index.indexOf(val);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  // ratingComponentClick(clickObj: any): void {
  //   const item = items.find((i: any) => i.id === clickObj.itemId);
  //   if (!!item) {
  //     item.rating = clickObj.rating;
  //     this.ratingClicked = clickObj.rating;
  //   }
  // }
}
