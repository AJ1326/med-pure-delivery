import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { OrderListRoutingModule } from './order-list-routing.module';
import { OrderListComponent } from './order-list.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, OrderListRoutingModule],
  declarations: [OrderListComponent]
})
export class OrderListModule {}
