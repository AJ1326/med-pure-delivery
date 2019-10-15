import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { OrderListRetailerModule } from '@app/order-list-retailer/order-list-retailer.module';
import { OrderListModule } from '@app/orderList/order-list.module';
import { HomeService } from '@app/home/home.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
    NgbModule.forRoot(),
    OrderListRetailerModule,
    OrderListModule
  ],
  declarations: [HomeComponent],
  providers: [HomeService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {}
