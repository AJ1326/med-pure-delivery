import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { environment } from '@env/environment';
import { finalize } from 'rxjs/operators';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

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
  retailorderList: any[] = [];
  startDate: any;
  endDate: any;
  //Date
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  @Input() orderListByFilterData: string;
  constructor(private orderListRetailerService: OrderListRetailerService, public calendar: NgbCalendar) {}

  ngOnInit() {
    this.retailOrderList('', '');
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
    this.orderListRetailerService
      .orderListData(startdate, enddate)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.retailorderList = data['orders'];
          console.log(this.retailorderList);
          this.success_message = 'Your order has been placed.';
        },
        (error: any) => {
          // log.debug(`Login error: ${error}`);
          this.error = error;
          this.success_message = 'Some error is occurred.';
        }
      );
  }

  private changeDate(date: any): void {
    const startDate =
      this.startDate === undefined || this.startDate === null
        ? ''
        : this.startDate.day + '-' + this.startDate.month + '-' + this.startDate.year;
    const endDate =
      this.endDate === undefined || this.endDate === null
        ? ''
        : this.endDate.day + '-' + this.endDate.month + '-' + this.endDate.year;
    this.retailOrderList(startDate, endDate);
  }
}
