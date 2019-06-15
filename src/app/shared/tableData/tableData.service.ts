import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { OrderList } from '@app/shared/Interfaces/tableData';
import { SortDirection } from '@app/shared/directives/sortable.directive';
import { ORDERLIST } from '@app/shared/dummydataTable/order-list';

interface SearchResult {
  orders: OrderList[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1: any, v2: any) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(orders: OrderList[], column: string, direction: string): OrderList[] {
  if (direction === '') {
    return orders;
  } else {
    return [...orders].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(orderlist: OrderList, term: string, pipe: PipeTransform) {
  return (
    orderlist.name.toLowerCase().includes(term) ||
    pipe.transform(orderlist.product.map(product => product.product_name)).includes(term) ||
    pipe.transform(orderlist.order_number).includes(term)
  );
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _orderlist$ = new BehaviorSubject<OrderList[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe(result => {
        this._orderlist$.next(result.orders);
        this._total$.next(result.total);
      });

    this._search$.next();
  }

  get orderlist$() {
    return this._orderlist$.asObservable();
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
  get searchTerm() {
    return this._state.searchTerm;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

    // 1. sort
    let order_lists = sort(ORDERLIST, sortColumn, sortDirection);

    // 2. filter
    order_lists = order_lists.filter(product => matches(product, searchTerm, this.pipe));
    const total = order_lists.length;

    // 3. paginate
    order_lists = order_lists.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({ orders: order_lists, total });
  }
}
