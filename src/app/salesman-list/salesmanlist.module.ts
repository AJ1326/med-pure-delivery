import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SalesmanlistRoutingModule } from './salesmanlist-routing.module';
import { SalesmanlistComponent } from './salesmanlist.component';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { PlacingOrderRoutingModule } from '@app/placingOrder/placingOrder-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlacingOrderService } from '@app/placingOrder/placingOrder.service';
import { SalesmanlistService } from '@app/salesman-list/salesmanlist.service';

@NgModule({
  imports: [CommonModule, TranslateModule, PlacingOrderRoutingModule, SharedModule, FormsModule, NgbModule.forRoot()],
  declarations: [SalesmanlistComponent],
  providers: [SalesmanlistService]
})
export class SalesmanlistModule {}
