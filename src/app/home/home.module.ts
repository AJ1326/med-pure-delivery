import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { OrderListRetailerModule } from '@app/order-list-retailer/order-list-retailer.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
    Ng2SmartTableModule,
    NgbModule.forRoot(),
    OrderListRetailerModule
  ],
  declarations: [HomeComponent],
  providers: [QuoteService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {}
