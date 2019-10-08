import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AddSalesmanRoutingModule } from './add-salesman-routing.module';
import { AddSalesmanComponent } from './add-salesman.component';
import { SharedModule } from '@app/shared';
import { OrderListService } from '@app/orderList/order-list.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AddSalesmanRoutingModule,
    Ng4GeoautocompleteModule.forRoot()
  ],
  declarations: [AddSalesmanComponent],
  providers: [OrderListService],
  exports: [AddSalesmanComponent]
})
export class AddSalesmanModule {}
