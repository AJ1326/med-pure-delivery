import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService, Logger } from '@app/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';
import { HomeService } from '@app/home/home.service';
import { SalesmanService } from '@app/salesman/salesman.service';
import { Router } from '@angular/router';

const log = new Logger('Salesman home');

@Component({
  selector: 'app-sales-man-home',
  templateUrl: './salesmanretailerList.component.html',
  styleUrls: ['./salesmanretailerList.component.scss'],
  providers: [DecimalPipe]
})
export class SalesmanretailerListComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  //Search bar
  model: any;
  searching = false;
  searchFailed = false;
  //Search bar ends
  //User info
  user_info: any = [];
  role_type: string;
  //User info ends
  filterData: any = [];
  error: any;
  filterValue = '';
  retailerInfo: any;
  retailer_list: any = [];
  listOfUsers: any;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private authenticationService: AuthenticationService,
    private tableservice: TableDataService,
    private router: Router,
    private salesmanService: SalesmanService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0];
    const pageURL = window.location.href;
    const lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
    if (this.role_type === 'salesman') {
      this.getListOfUser();
    } else {
    }
  }

  navigateAddOrderPage(url: any, retailer_id?: string): void {
    console.log('url', url);
    this.router.navigate(['salesman/' + url], { queryParams: { retailer_slug: retailer_id } });
    // this.router.navigateByUrl('salesman/' + url + '/' + retailer_id);
  }

  getListOfUser(): void {
    this.salesmanService
      .getRetailerList(this.role_type)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.listOfUsers = data;
        },
        (error: any) => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  selectedItem(retailername: any) {
    this.retailerInfo = retailername['name'];
    this.isLoading = true;
    this.salesmanService
      .retailerList(retailername['slug'])
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.retailer_list = data;
        },
        error => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.salesmanService.search(term).pipe(
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
}
