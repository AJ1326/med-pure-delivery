import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorComponent } from '@app/error/error.component';
import { ErrorRoutingModule } from '@app/error/error-routing.module';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [CommonModule, TranslateModule, SharedModule, ErrorRoutingModule],
  declarations: [ErrorComponent]
})
export class ErrorModule {}
