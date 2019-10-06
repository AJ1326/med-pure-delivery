import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { ForgetPasswordRoutingModule } from './forgetPassword-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbActiveModal, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderListRetailerModule } from '@app/order-list-retailer/order-list-retailer.module';
import { OrderListModule } from '@app/orderList/order-list.module';
import { RouterModule } from '@angular/router';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { ForgetPasswordComponent } from '@app/forgetPassword/home/forgetPassword.component';
import { ForgetPasswordService } from '@app/forgetPassword/forgetPassword.service';
import { ErrorModule } from '@app/error/error.module';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    Ng4GeoautocompleteModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    ForgetPasswordRoutingModule,
    FormsModule,
    Ng2SmartTableModule,
    OrderListRetailerModule,
    OrderListModule,
    ErrorModule
  ],
  entryComponents: [],
  declarations: [ForgetPasswordComponent],
  providers: [ForgetPasswordService, NgbActiveModal, NgbModalConfig, NgbModal],
  exports: [ForgetPasswordComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgetPasswordModule {}
