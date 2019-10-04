import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, finalize, switchMap, tap } from 'rxjs/operators';
import { OrderList } from '@app/shared/Interfaces/tableData';
import { SortDirection } from '@app/shared/directives/sortable.directive';
import { ORDERLIST } from '@app/shared/dummydataTable/order-list';
import { URLS } from '@app/core/common/url-constant';
import { HttpClient } from '@angular/common/http';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';
import { AuthenticationService, Logger } from '@app/core';

interface SearchResult {
  orders: OrderList[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  // searchTerm: string;
  // sortColumn: string;
  // sortDirection: SortDirection;
}

function compare(v1: any, v2: any) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

// function sort(orders: OrderList[], column: string, direction: string): OrderList[] {
//   if (direction === '') {
//     return orders;
//   } else {
//     return [...orders].sort((a, b) => {
//       const res = compare(a[column], b[column]);
//       return direction === 'asc' ? res : -res;
//     });
//   }
// }

// function matches(orderlist: OrderList, term: string, pipe: PipeTransform) {
//   return (
//     orderlist.name.toLowerCase().includes(term) ||
//     pipe.transform(orderlist.product.map(product => product.product_name)).includes(term) ||
//     pipe.transform(orderlist.order_number).includes(term)
//   );
// }

const log = new Logger('Login');

@Injectable({ providedIn: 'root' })
export class TableDataService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _orderlist$ = new BehaviorSubject<OrderList[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private _filterType$ = new BehaviorSubject<string>('');
  private role_type: string;
  private error: string;
  public isLoading = false;

  private _state: State = {
    page: 1,
    pageSize: 10,
    startDate: '',
    endDate: ''
  };

  constructor(
    private pipe: DecimalPipe,
    private http: HttpClient,
    public orderListRetailerService: OrderListRetailerService,
    public authenticationService: AuthenticationService
  ) {
    this.role_type = this.authenticationService.userInfoType();
    console.log('this.role_type tabledata', this.role_type);
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe(result => {});

    this._search$.next();
  }

  // getOrderList(orders: any): void {
  //   // this._orderlist$.next(orders);
  //   this._search$
  //     .pipe(
  //       tap(() => this._loading$.next(true)),
  //       debounceTime(200),
  //       switchMap(() => this._search()),
  //       delay(200),
  //       tap(() => this._loading$.next(false))
  //     )
  //     .subscribe(result => {
  //       this._orderlist$.next(result.orders);
  //       this._total$.next(result.total);
  //     });
  //
  //   this._search$.next();
  // }

  get orderlist$() {
    return this._orderlist$.asObservable();
  }
  get filterTypeValue() {
    console.log('this._filterType.value', this._filterType$);
    return this._filterType$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }
  get startDate() {
    return this._state.startDate;
  }
  get endDate() {
    return this._state.endDate;
  }
  // get searchTerm() {
  //   return this._state.searchTerm;
  // }

  SetfilterTypeValue(_filterType$: string) {
    // this._set({ _filterType$ });
    // return this._filterType$.asObservable();
    const endDate: any = null;
    const startDate: any = null;
    const page = 1;
    this._filterType$.next(_filterType$);
    this._set({ endDate, startDate, page });
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set startDate(startDate: string) {
    const page = 1;
    this._set({ startDate, page });
  }
  set endDate(endDate: string) {
    const page = 1;
    this._set({ endDate, page });
  }
  updateDate(startDate: string, endDate: string) {
    const page = 1;
    // this._filterType$.next(filterType);
    this._set({ endDate, startDate, page });
  }
  // set searchTerm(searchTerm: string) {
  //   this._set({ searchTerm });
  // }
  // set sortColumn(sortColumn: string) {
  //   this._set({ sortColumn });
  // }
  // set sortDirection(sortDirection: SortDirection) {
  //   this._set({ sortDirection });
  // }

  // private retailOrderList(startdate: any, enddate: any): void {

  // }

  public _search(): Observable<SearchResult> {
    this.isLoading = true;
    const { pageSize, page, startDate, endDate } = this._state;

    const order_lists: any = [];
    const total = 0;
    this._orderlist$.next([]);
    this.role_type = this.authenticationService.userInfoType();

    this.orderListRetailerService
      .orderListData(this.startDate, this.endDate, this.page, this.pageSize, this.role_type, this._filterType$.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this._orderlist$.next(data['results']);
          this._total$.next(data['count']);
        },
        (error: any) => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
    // 1. sort
    // 2. filter
    // order_lists = order_lists.filter(product => matches(product, searchTerm, this.pipe));
    // const total = order_lists.length;

    // 3. paginate
    // order_lists = order_lists.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ orders: order_lists, total: total });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
}
