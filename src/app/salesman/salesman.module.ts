import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { SalesmanRoutingModule } from './salesman-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbActiveModal, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderListRetailerModule } from '@app/order-list-retailer/order-list-retailer.module';
import { OrderListModule } from '@app/orderList/order-list.module';
import { HomeService } from '@app/home/home.service';
import { SalesmanhomeComponent } from '@app/salesman/home/salesmanhome.component';
import { SalesmanService } from '@app/salesman/salesman.service';
import { SalesmanretailerListComponent } from '@app/salesman/retailerList/salesmanretailerList.component';
import { SalesmanaddRetailerComponent } from '@app/salesman/addRetailer/salesmanaddRetailer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    SalesmanRoutingModule,
    FormsModule,
    Ng2SmartTableModule,
    OrderListRetailerModule,
    OrderListModule
  ],
  entryComponents: [],
  declarations: [SalesmanhomeComponent, SalesmanretailerListComponent, SalesmanaddRetailerComponent],
  providers: [SalesmanService, NgbActiveModal, NgbModalConfig, NgbModal],
  exports: [SalesmanhomeComponent, SalesmanretailerListComponent, SalesmanaddRetailerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SalesmanModule {}
