import { AfterViewInit, Component, OnInit, QueryList, ViewChildren, OnDestroy } from '@angular/core';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService, Logger } from '@app/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';
import { HomeService } from '@app/home/home.service';
import { SalesmanService } from '@app/salesman/salesman.service';
import { Router, ActivatedRoute } from '@angular/router';

const log = new Logger('Salesman home');

@Component({
  selector: 'app-sales-man-home',
  templateUrl: './salesmanretailerList.component.html',
  styleUrls: ['./salesmanretailerList.component.scss'],
  providers: [DecimalPipe]
})
export class SalesmanretailerListComponent implements OnInit, OnDestroy {
  searchTextChanged = new Subject<string>();

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
  list_sub: any;
  list_type: string | null = null;
  search_subscription: any;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private authenticationService: AuthenticationService,
    private tableservice: TableDataService,
    private router: Router,
    private route: ActivatedRoute,
    private salesmanService: SalesmanService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0];
    const pageURL = window.location.href;
    const lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);

    this.list_sub = this.route.data.subscribe(v => {
      console.log(v, typeof v['list_type']);
      if (v['list_type'] === 'retailer_list') {
        this.list_type = 'Retailer';
      } else if (v['list_type'] === 'distributor_list') {
        this.list_type = 'Distributor';
      }
      if (this.role_type === 'salesman') {
        this.getListOfUser();
      }
    });

    this.search_subscription = this.searchTextChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(v => {
        if (this.list_type) {
          this.getListOfUser(v);
        }
      });
  }

  ngOnDestroy() {
    this.list_sub.unsubscribe();
    this.search_subscription.unsubscribe();
  }

  navigateAddOrderPage(url: any, retailer_id?: string): void {
    console.log('url', url);
    this.router.navigate(['salesman/' + url], { queryParams: { retailer_slug: retailer_id } });
    // this.router.navigateByUrl('salesman/' + url + '/' + retailer_id);
  }

  getListOfUser(search: string = ''): void {
    this.searching = true;
    this.salesmanService['get' + this.list_type + 'List'](search)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.listOfUsers = data['results'];
          this.searching = false;
        },
        (error: any) => {
          log.debug(`Login error: ${error}`);
          this.error = error;
          this.searching = false;
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

  search($event: any) {
    this.searchTextChanged.next($event);
  }

  formatter = (x: { name: string }) => x.name;
}
