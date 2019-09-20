import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SavingNotesRoutingModule } from './saving-notes-routing.module';
import { SavingNotesComponent } from './saving-notes.component';
import { SharedModule } from '@app/shared';
import { OrderListRetailerService } from '@app/order-list-retailer/order-list-retailer.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, NgbModule, FormsModule, SavingNotesRoutingModule],
  declarations: [SavingNotesComponent],
  providers: [OrderListRetailerService],
  exports: [SavingNotesComponent]
})
export class SavingNotesModule {}
