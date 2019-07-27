import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';

import { environment } from '@env/environment';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';
import { OrderListService } from '@app/orderList/order-list.service';
import { finalize } from 'rxjs/operators';
import { TableDataService } from '@app/shared/tableData/tableData.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnChanges, OnInit {
  version: string = environment.version;
  success_message: string;
  isLoading: false;
  error: string;
  distributorOrderList: any[];
  // Date
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  startDate: any;
  endDate: any;
  pageCount = 0;
  filter_type_value: any;

  @Input() orderListByFilterData: string;
  constructor(private orderListDistributorService: OrderListService, private tableservice: TableDataService) {
    tableservice.orderlist$.subscribe(data => {
      this.distributorOrderList = data;
    });
    tableservice.filterTypeValue.subscribe(data => {
      this.filter_type_value = data;
    });
  }

  ngOnInit() {
    // this.tableservice._search(this.orderListByFilterData);
    // console.log('orderListByFilterData', this.orderListByFilterData);
    this.tableservice._search();
  }

  ngOnChanges(changes: SimpleChanges) {
    // const orderListByFilterData: SimpleChange = changes.orderListByFilterData;
    // console.log('prev value: ', orderListByFilterData.previousValue);
    // console.log('got name: ', orderListByFilterData.currentValue);
    // this.filter_type_value = orderListByFilterData.currentValue;
    // this.tableservice._search(this.filter_type_value);
    // this.orderListByFilterData = ;
  }

  public changeStartDate(date: any): void {
    const startD =
      this.startDate === undefined || this.startDate === null
        ? ''
        : this.startDate.year + '-' + this.startDate.month + '-' + this.startDate.day;

    this.tableservice.startDate = startD;
  }

  public changeEndDate(date: any): void {
    const endD =
      this.endDate === undefined || this.endDate === null
        ? ''
        : this.endDate.year + '-' + this.endDate.month + '-' + this.endDate.day;
    this.tableservice.endDate = endD;
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
}
