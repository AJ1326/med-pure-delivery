import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService, Logger } from '@app/core';
import { BehaviorSubject } from 'rxjs';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { finalize } from 'rxjs/operators';
import { HomeService } from '@app/home/home.service';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('Home');

const dummyfilterdata = [
  {
    index: 1,
    card_title: 'Total orders',
    card_value: 7,
    card_description: 'By product',
    card_type: 'all-order-list'
  },
  {
    index: 2,
    card_title: 'List of orders',
    card_value: 7,
    card_description: 'By distributor',
    card_type: 'by-source'
  },
  {
    index: 3,
    card_title: 'Pending orders',
    card_value: 7,
    card_description: 'By product',
    card_type: 'pending-order-list'
  },
  {
    index: 4,
    card_title: 'Fast moving products',
    card_value: 7,
    card_description: 'By product',
    card_type: 'fast-moving-order-list'
  }
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DecimalPipe]
})
export class HomeComponent implements OnInit {
  orderFromSalesman = '';
  isLoading: boolean;
  // private filterCard = new BehaviorSubject<string>('');
  user_info: any = [];
  role_type: string;
  activeCard: string;
  filterData: any = [];
  error: any;
  filterTitle = '';
  filterValue = '';

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private authenticationService: AuthenticationService,
    private tableservice: TableDataService,
    private homeService: HomeService,
    private router: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0];
    const pageURL = window.location.href;
    const lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
    this.router.queryParams.subscribe(params => {
      // console.log('params', params); // {order: "popular"}
      this.orderFromSalesman = params['retailer_slug'];
      localStorage.setItem('isSalesmanOrderView', params['retailer_slug']);
    });
    if (this.role_type === 'retailer') {
      this.tableservice.SetfilterTypeValue('all-order-list');
      this.selectFilterCard('all-order-list');
      this.cardData('all-order-list');
    } else {
      this.tableservice.SetfilterTypeValue('pending-order-list');
      this.selectFilterCard('pending-order-list');
      this.cardData('pending-order-list');
    }
    //
    // this.tableservice.filterTypeValue.subscribe((data: any) => {
    //   if (data) {
    //     console.log('------------------->: ', data, typeof data);
    //   }
    // });
  }

  cardData(filter_title?: string): void {
    this.homeService
      .cardListData(this.role_type, this.orderFromSalesman)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          const bar = data.sort();
          this.filterData = bar;
          const filterData = this.filterData.find((data: any) => data.card_type === filter_title);
          this.filterTitle = filterData.card_title;
          this.filterValue = filterData.card_value;
        },
        (error: any) => {
          this.filterData = dummyfilterdata;
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  selectFilterCard(id_value: string, filter_title?: string, filter_value?: string, send_to_service?: true): void {
    this.activeCard = id_value;
    this.filterTitle = filter_title;
    this.filterValue = filter_value;
    this.tableservice.SetfilterTypeValue(id_value);
  }
}
