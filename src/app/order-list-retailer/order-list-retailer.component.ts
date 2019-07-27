import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { environment } from '@env/environment';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { TableDataService } from '@app/shared/tableData/tableData.service';

@Component({
  selector: 'app-retailer-order-list',
  templateUrl: './order-list-retailer.component.html',
  styleUrls: ['./order-list-retailer.component.scss']
})
export class OrderListRetailerComponent implements OnInit, AfterViewInit {
  version: string = environment.version;
  isLoading: false;
  error: string;
  retailorderList: any[];
  startDate: any;
  endDate: any;
  // Date
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  pageCount = 0;
  filter_type_value: any;

  constructor(
    private orderListRetailerService: OrderListRetailerService,
    public calendar: NgbCalendar,
    private tableservice: TableDataService
  ) {
    tableservice.orderlist$.subscribe(data => {
      console.log('retiler list : ', data);
      this.retailorderList = data;
    });
  }

  ngOnInit() {
    this.tableservice.SetfilterTypeValue(this.filter_type_value);
  }

  formatDate(date: any) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    this.endDate = { year: 1993, month: '07', day: '23' };
    this.startDate = { year: 1993, month: '07', day: '23' };

    return [year, month, day].join('-');
  }

  updateDate() {
    const startD =
      this.startDate === undefined || this.startDate === null
        ? ''
        : this.startDate.year + '-' + this.startDate.month + '-' + this.startDate.day;
    const endD =
      this.endDate === undefined || this.endDate === null
        ? ''
        : this.endDate.year + '-' + this.endDate.month + '-' + this.endDate.day;
    this.tableservice.updateDate(startD, endD);
  }

  ngAfterViewInit(): void {
    this.tableservice.filterTypeValue.subscribe(data => {
      this.filter_type_value = data;
      this.startDate = undefined;
      this.endDate = undefined;
    });
  }
}
