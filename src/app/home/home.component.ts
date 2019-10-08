import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService, Logger } from '@app/core';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { finalize } from 'rxjs/operators';
import { HomeService } from '@app/home/home.service';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('Home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DecimalPipe]
})
export class HomeComponent implements OnInit {
  orderFromSalesman = '';
  isLoading: boolean;
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
    // this.isLoading = true;
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0];
    this.router.queryParams.subscribe(params => {
      this.orderFromSalesman = params['retailer_slug'];
      localStorage.setItem('isSalesmanOrderView', params['retailer_slug']);
    });
    if (this.role_type === 'retailer' || this.role_type === 'salesman') {
      this.tableservice.SetfilterTypeValue('all-order-list');
      this.selectFilterCard('all-order-list');
      this.cardData('all-order-list');
    } else {
      this.tableservice.SetfilterTypeValue('pending-order-list');
      this.selectFilterCard('pending-order-list');
      this.cardData('pending-order-list');
    }
  }

  orderAcceptedCSV(value: boolean): void {
    if (value) {
      this.cardData();
    }
  }

  cardData(filter_title?: string): void {
    this.homeService
      .cardListData(this.role_type, this.orderFromSalesman)
      .pipe(
        finalize(() => {
          // this.isLoading = false;
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
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  selectFilterCard(id_value: string, filter_title?: string, filter_value?: string, send_to_service?: true): void {
    this.activeCard = id_value;
    this.filterTitle = filter_title;
    this.filterValue = filter_value;
    this.cardData(this.activeCard);
    this.tableservice.SetfilterTypeValue(id_value);
  }
}
