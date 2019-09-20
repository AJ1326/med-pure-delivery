import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ComingSoonRoutingModule } from './coming-soon-routing.module';
import { ComingSoonComponent } from './coming-soon.component';

@NgModule({
  imports: [CommonModule, TranslateModule, ComingSoonRoutingModule],
  exports: [ComingSoonComponent],
  declarations: [ComingSoonComponent]
})
export class ComingSoonModule {}
