import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { environment } from '@env/environment';
import { finalize } from 'rxjs/operators';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { TableDataService } from '@app/shared/tableData/tableData.service';

@Component({
  selector: 'app-retailer-order-list',
  templateUrl: './order-list-retailer.component.html',
  styleUrls: ['./order-list-retailer.component.scss']
})
export class OrderListRetailerComponent implements OnInit {
  version: string = environment.version;
  success_message: string;
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

  @Input() orderListByFilterData: string;
  constructor(
    private orderListRetailerService: OrderListRetailerService,
    public calendar: NgbCalendar,
    private tableservice: TableDataService
  ) {
    tableservice.orderlist$.subscribe(data => {
      this.retailorderList = data;
    });
  }

  ngOnInit() {
    this.tableservice._search();
  }
  //
  // public changeStartDate(date: any): void {
  //   const startD =
  //     this.startDate === undefined || this.startDate === null
  //       ? ''
  //       : this.startDate.year + '-' + this.startDate.month + '-' + this.startDate.day;
  //
  //   this.tableservice.startDate = startD;
  // }
  //
  // public changeEndDate(date: any): void {
  //   const endD =
  //     this.endDate === undefined || this.endDate === null
  //       ? ''
  //       : this.endDate.year + '-' + this.endDate.month + '-' + this.endDate.day;
  //   this.tableservice.endDate = endD;
  // }

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

  private setStartDateFilter(event: any): void {
    console.log('event', event);
    // this.startdatevalue = event;
  }

  private setEndDateFilter(event: any): void {
    console.log('event', event);
    // this.enddatevalue = event;
  }

  private retailOrderList(startdate: any, enddate: any): void {
    // this.orderListRetailerService
    // .orderListData(startdate, enddate, 1)
    // .pipe(
    //   finalize(() => {
    //     this.isLoading = false;
    //   })
    // )
    // .subscribe(
    //   (data: []) => {
    //     this.retailorderList = data['results'];
    //     this.pageCount = data['count'];
    //     console.log(this.retailorderList);
    //     this.success_message = 'Your order has been placed.';
    //   },
    //   (error: any) => {
    //     // log.debug(`Login error: ${error}`);
    //     this.error = error;
    //     this.success_message = 'Some error is occurred.';
    //   }
    // );
  }
}
