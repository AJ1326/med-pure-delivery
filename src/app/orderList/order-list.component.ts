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

  constructor(private orderListDistributorService: OrderListService) {}

  selectFilterCard(id_value: string): void {
    const filterCardArray = ['order-list', 're-order-list', 'open-order-list', 'closed-order-list'];
    const index = filterCardArray.indexOf(id_value);
    if (index > -1) {
      filterCardArray.splice(index, 1);
    }
    for (let i = 0; i < filterCardArray.length; i++) {
      const remove_element = document.getElementById(filterCardArray[i]);
      remove_element.classList.remove('active_card');
    }
    const add_element = document.getElementById(id_value);
    add_element.classList.add('active_card');
  }

  private distributorOrderList(): void {
    this.orderListDistributorService
      .distributorList()
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

  ngOnInit() {
    this.distributorOrderList();
  }
}
