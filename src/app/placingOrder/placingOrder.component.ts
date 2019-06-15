import { Component, Injectable, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, finalize } from 'rxjs/operators';
import { PlacingOrderService } from '@app/placingOrder/placingOrder.service';
import { Logger } from '@app/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Route, Router } from '@angular/router';

const log = new Logger('Placing Order');

const items = [
  {
    distributor: 'abc Test',
    discount: null,
    stock: 100,
    company: 'AD',
    pack: '1x10',
    rate: 250,
    mrp: 350,
    vat: 6,
    rating: 4
  },
  {
    distributor: 'abc Test2',
    discount: 10,
    stock: 50,
    company: 'AD',
    pack: '1x10',
    rate: 250,
    mrp: 350,
    vat: 6,
    rating: 5
  },
  {
    distributor: 'abc Test3',
    discount: 5,
    stock: 80,
    company: 'AD',
    pack: '1x10',
    rate: 250,
    mrp: 350,
    vat: 6,
    rating: 3
  },
  {
    distributor: 'abc Test4',
    discount: null,
    stock: 70,
    company: 'AD',
    pack: '1x10',
    rate: 250,
    mrp: 350,
    vat: 6,
    rating: 4
  }
];

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
})
export class PlacingOrderComponent implements OnInit {
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
  success_message: string;
  modalReference: any;
  show_order_qauntity_error_index: any[] = [];
  distributor_list_order_index: any[] = [];

  constructor(
    private distributorService: PlacingOrderService,
    private modalService: NgbModal,
    private _service: WikipediaService,
    private _hotkeysService: HotkeysService,
    public route: Router
  ) {
    this._hotkeysService.add(
      new Hotkey(
        'command+h',
        (event: KeyboardEvent): boolean => {
          this.route.navigateByUrl('/');
          return false; // Prevent bubbling
        }
      )
    );
  }

  selectedItem(productname: any) {
    console.log('productname:', productname);
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
          this.distributor_list = items;
        }
      );
  }

  addOrder(slug: string, orderNumber: number) {
    this.calldisableBtnFunction(slug);
    const addOrder = this.distributor_list[orderNumber];
    this.order_list = this.order_list.concat(addOrder);
  }

  removeOrder(slug: string, orderNumber: number) {
    this.callunableBtnFunction(slug);
    const removeOrder = this.order_list.splice(orderNumber, 1);
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
    this.success_message = 'Welcome !!!!';
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

  private submitOrder(order: []): void {
    order.map(data => {
      delete data['company'];
      delete data['discount'];
      delete data['distributor'];
      delete data['mrp'];
      delete data['pack'];
      delete data['rate'];
      delete data['rating'];
      delete data['pack'];
      delete data['vat'];
      delete data['uuid'];
      data['quantity'] = data['stock'];
      delete data['stock'];
    });
    this.distributorService
      .orderListPlaced(order)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.success_message = 'Your order has been placed.';
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
          this.success_message = 'Some error is occurred.';
        }
      );
  }

  private receiveMessage(accept_type: any): void {
    if (accept_type === 'Yes') {
      this.submitOrder(this.order_list);
    }
  }

  private closeAlertPopUp(): void {}

  private valueChange(event: number, order_index: number, max_order: number, order_uuid: string): void {
    this.order_list.map((i, index) => {
      if (index === order_index) {
        if (event > +max_order) {
          if (!(this.show_order_qauntity_error_index.indexOf(order_uuid) > -1)) {
            this.show_order_qauntity_error_index.push(order_uuid);
          }
        } else {
          const index = this.show_order_qauntity_error_index.indexOf(order_uuid);
          if (index > -1) {
            this.show_order_qauntity_error_index.splice(index, 1);
          }
        }
        return { ...i, stock: event };
      }
      return { ...i };
    });
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

  ratingComponentClick(clickObj: any): void {
    const item = items.find((i: any) => i.id === clickObj.itemId);
    if (!!item) {
      item.rating = clickObj.rating;
      this.ratingClicked = clickObj.rating;
    }
  }
}
