import { Unsubscribable } from '@app/shared/utils/unsubscribable';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { ColumnSort } from '@app/shared/models/column-sort.model';
import { catchError, debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PagedApiResponse } from '@app/shared/models/paged-api-response.model';
import { OnInit } from '@angular/core';

/**
 * Table components extending this class are assumed to have server side paging and sorting
 * DATATYPE - model that represents a single table row
 * IDTYPE - type of the unique identifier of the DATATYPE; used by getId
 * OBS - optional data type of changes that can happen impacting query results; used in combination with customSearchChangeCause$
 */
export abstract class AbstractDataTable<DATATYPE, IDTYPE, OBS = undefined> extends Unsubscribable implements OnInit {
  isLoadingData$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedDataRows$: BehaviorSubject<DATATYPE[]> = new BehaviorSubject<DATATYPE[]>([]);
  dataRowsList$: BehaviorSubject<DATATYPE[]> = new BehaviorSubject([]);
  allRowsSelected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(0);
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(10);
  totalElements$: BehaviorSubject<number> = new BehaviorSubject(0);
  sorting$: BehaviorSubject<ColumnSort>;
  search$: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  filter$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  manualRefresh$: BehaviorSubject<number> = new BehaviorSubject(0);

  protected constructor() {
    super();
    this.sorting$ = new BehaviorSubject(this.defaultSorting);
  }

  /**
   * Should be overridden if a default sorting is required
   */
  get defaultSorting(): ColumnSort {
    return undefined;
  }

  /**
   * Should be overridden if there are criteria for rows of data to be selectable or not
   */
  isSelectable(data: DATATYPE): boolean {
    return true;
  }

  /**
   * Should be overridden if there are extra changes that can happen to impact the result of the search query
   */
  get customSearchChangeCause$(): Observable<OBS> {
    return of(undefined);
  }

  /**
   * Implementation has to fetch the data from the backend
   */
  abstract fetchData(
    start: number,
    limit: number,
    sorting: ColumnSort,
    search: string,
    filter: any,
    customValue?: OBS
  ): Observable<PagedApiResponse<DATATYPE>>;

  /**
   * Implementation should be a function that returns the identifying property of the data object that can be compared using ===
   */
  abstract getId(data: DATATYPE): IDTYPE;

  /**
   * Make sure super is called when overriding ngOnInit()
   */
  ngOnInit(): void {
    this.listenToChanges();
  }

  setPage(pageNumber: number) {
    this.pageNumber$.next(pageNumber);
  }

  setPageSize(pageSize: number) {
    this.pageSize$.next(pageSize);
    this.pageNumber$.next(0);
  }

  onSort(sorts: ColumnSort[]) {
    this.sorting$.next(sorts[0]);
    this.pageNumber$.next(0);
  }

  selectionChanged(selectedData: DATATYPE[]) {
    this.selectedDataRows$.next(selectedData);
    this.checkAllRowsSelected();
  }

  refreshData() {
    this.manualRefresh$.next(this.manualRefresh$.getValue() + 1);
  }

  toggleSelectedOnCurrentPage(checked: boolean) {
    let currentSelectedRows = this.selectedDataRows$.getValue();
    const currentDataList = this.dataRowsList$.getValue();
    if (checked) {
      currentDataList
        .filter(r => this.isSelectable(r))
        .forEach(row => {
          const existingId = currentSelectedRows.findIndex(r => this.getId(r) === this.getId(row));
          if (existingId < 0) {
            currentSelectedRows.push(row);
          }
        });
    } else {
      currentDataList
        .filter(r => this.isSelectable(r))
        .forEach(row => {
          currentSelectedRows = currentSelectedRows.filter(r => this.getId(r) !== this.getId(row));
        });
    }

    this.selectedDataRows$.next(currentSelectedRows.slice());
    this.allRowsSelected$.next(checked);
  }

  unselectAll(currentPageOnly = false) {
    if (currentPageOnly) {
      this.toggleSelectedOnCurrentPage(false);
    } else {
      this.selectedDataRows$.next([]);
    }
  }

  updateSearchFilter(searchTerm: string) {
    const val = searchTerm.toLowerCase();
    this.search$.next(val);
    this.pageNumber$.next(0);
  }

  keepSelectedIds(idList: IDTYPE[]) {
    const idListCpy = [...idList];
    const dataList = this.dataRowsList$.getValue();
    const currentSelected = this.selectedDataRows$.getValue();
    const selectedRequests: DATATYPE[] = [];
    // rows that are already selected remain selected
    currentSelected.forEach((row: DATATYPE) => {
      if (idListCpy.includes(this.getId(row))) {
        selectedRequests.push(row);
        // remove already included elements from id list to prevent double inclusion later
        idListCpy.splice(idListCpy.indexOf(this.getId(row)), 1);
      }
    });
    // add newly selected rows (only of current page!)
    selectedRequests.concat(dataList.filter(row => idListCpy.includes(this.getId(row))));

    this.selectedDataRows$.next(selectedRequests);
    this.checkAllRowsSelected();
  }

  protected checkAllRowsSelected() {
    const currentSelectedProviders = this.selectedDataRows$.getValue();
    const currentRequestList = this.dataRowsList$.getValue();
    const allSelected = currentRequestList.every(
      row => currentSelectedProviders.findIndex(r => this.getId(r) === this.getId(row)) >= 0
    );
    this.allRowsSelected$.next(allSelected);
  }

  private listenToChanges() {
    combineLatest(
      this.pageNumber$,
      this.pageSize$,
      this.sorting$,
      this.search$,
      this.filter$,
      this.customSearchChangeCause$,
      this.manualRefresh$
    )
      .pipe(
        tap(() => this.isLoadingData$.next(true)),
        debounceTime(200),
        takeUntil(this.unsubscribe$),
        switchMap(
          ([pnr, pageSize, sorting, search, filters, customValue, refreshNr]: [
            number,
            number,
            ColumnSort,
            string,
            any,
            OBS,
            number
          ]) => this.fetchData(pageSize * pnr, pageSize, sorting, search, filters, customValue)
        ),
        catchError(() => {
          this.isLoadingData$.next(false);
          return EMPTY;
        })
      )
      .subscribe(
        (result: PagedApiResponse<DATATYPE>) => {
          this.totalElements$.next(result.count);

          const currentSelectedProviders = this.selectedDataRows$.getValue();
          result.results.forEach(item => {
            const existingIdx = currentSelectedProviders.findIndex((r: DATATYPE) => this.getId(r) === this.getId(item));
            if (existingIdx >= 0) {
              currentSelectedProviders[existingIdx] = item;
            }
          });
          this.dataRowsList$.next(result.results);
          this.selectedDataRows$.next(currentSelectedProviders.slice());
          this.checkAllRowsSelected();
          this.isLoadingData$.next(false);
        },
        error => {
          console.error(`ERROR fetching data`, error);
          this.isLoadingData$.next(false);
        }
      );
  }
}
