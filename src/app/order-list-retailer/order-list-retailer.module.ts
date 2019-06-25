import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { OrderListRetailerRoutingModule } from './order-list-retailer-routing.module';
import { OrderListRetailerComponent } from './order-list-retailer.component';
import { SharedModule } from '@app/shared';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, OrderListRetailerRoutingModule],
  declarations: [OrderListRetailerComponent],
  providers: [OrderListRetailerService],
  exports: [OrderListRetailerComponent]
})
export class OrderListRetailerModule {}
