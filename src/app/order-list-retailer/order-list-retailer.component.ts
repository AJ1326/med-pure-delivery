import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { finalize } from 'rxjs/operators';
import { PlacingOrderService } from '@app/placingOrder/placingOrder.service';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';
// import {log} from "@util";

// const dataorder = [
//   {
//     "order_id": "a50f67db-0c10-4b18-81c3-a9688149e0c5",
//     "order_date": "2019-06-25",
//     "total_amount": 150000,
//     "order_details": [
//       {
//         "quantity": 1,
//         "product": {
//           'available_quantity': 300,
//           'price': 234,
//           "name": "EVICT XF 90ML SLN",
//           "slug": "evict-xf-90ml-sln"
//         },
//         "distributor": {
//           "name": "abc Test",
//           "slug": "abc-test"
//         }
//       },
//       {
//         "quantity": 1,
//         "product": {
//           "name": "CYP-L DROP",
//           "slug": "cyp-l-drop"
//         },
//         "distributor": {
//           "name": "abc Test",
//           "slug": "abc-test"
//         }
//       }
//     ]
//   },
//   {
//     "order_id": "a50f67db-0c10-4b18-81c3-a9688149e0c5",
//     "order_date": "2019-06-25",
//     "order_details": [
//       {
//         "total_amount": 150000,
//         "quantity": 1,
//         "product": {
//           'available_quantity': 300,
//           'price': 234,
//           "name": "EVICT XF 90ML SLN",
//           "slug": "evict-xf-90ml-sln"
//         },
//         "distributor": {
//           "name": "abc Test",
//           "slug": "abc-test"
//         }
//       },
//       {
//         "quantity": 1,
//         "product": {
//           "name": "CYP-L DROP",
//           "slug": "cyp-l-drop"
//         },
//         "distributor": {
//           "name": "abc Test",
//           "slug": "abc-test"
//         }
//       }
//     ]
//   },
//   {
//     "order_id": "a50f67db-0c10-4b18-81c3-a9688149e0c5",
//     "order_date": "2019-06-25",
//     "order_details": [
//       {
//         "total_amount": 150000,
//         "quantity": 1,
//         "product": {
//           'available_quantity': 300,
//           'price': 234,
//           "name": "EVICT XF 90ML SLN",
//           "slug": "evict-xf-90ml-sln"
//         },
//         "distributor": {
//           "name": "abc Test",
//           "slug": "abc-test"
//         }
//       },
//       {
//         "quantity": 1,
//         "product": {
//           "name": "CYP-L DROP",
//           "slug": "cyp-l-drop"
//         },
//         "distributor": {
//           "name": "abc Test",
//           "slug": "abc-test"
//         }
//       }
//     ]
//   }
// ]

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

  constructor(private orderListRetailerService: OrderListRetailerService) {}

  ngOnInit() {
    this.retailOrderList();
  }

  private retailOrderList(): void {
    this.orderListRetailerService
      .orderListData()
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
}
