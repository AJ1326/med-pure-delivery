import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';
import { OrderListService } from '@app/orderList/order-list.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  version: string = environment.version;
  success_message: string;
  isLoading: false;
  error: string;
  distributor_orderList: any[] = [];
  //Date
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  startDate: any;
  endDate: any;

  constructor(private orderListDistributorService: OrderListService) {
    console.log('hsdgfjhasgfashjdfgkasjfgashj');
  }

  private distributorOrderList(startdate: any, enddate: any): void {
    this.orderListDistributorService
      .distributorList(startdate, enddate)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.distributor_orderList = data['orders'];
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
    this.distributorOrderList(startDate, endDate);
  }

  ngOnInit() {
    this.distributorOrderList('', '');
  }
}
