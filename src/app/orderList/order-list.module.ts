import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OrderListRoutingModule } from './order-list-routing.module';
import { OrderListComponent } from './order-list.component';
import { SharedModule } from '@app/shared';
import { OrderListService } from '@app/orderList/order-list.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, NgbModule, FormsModule, OrderListRoutingModule],
  declarations: [OrderListComponent],
  providers: [OrderListService],
  exports: [OrderListComponent]
})
export class OrderListModule {}
