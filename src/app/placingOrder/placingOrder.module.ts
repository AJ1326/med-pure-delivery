import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PlacingOrderRoutingModule } from './placingOrder-routing.module';
import { PlacingOrderComponent } from './placingOrder.component';
import { SharedModule } from '@app/shared';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlacingOrderService } from '@app/placingOrder/placingOrder.service';
import { HotkeyModule } from 'angular2-hotkeys';

@NgModule({
  imports: [CommonModule, TranslateModule, PlacingOrderRoutingModule, SharedModule, FormsModule, NgbModule.forRoot()],
  providers: [PlacingOrderService],
  declarations: [PlacingOrderComponent]
})
export class PlacingOrderModule {}
