import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { OrderListRetailerRoutingModule } from './order-list-retailer-routing.module';
import { OrderListRetailerComponent } from './order-list-retailer.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, OrderListRetailerRoutingModule],
  declarations: [OrderListRetailerComponent]
})
export class OrderListRetailerModule {}
