import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ChangePasswordRoutingModule } from './changePassword-routing.module';
import { ChangePasswordComponent } from '@app/changePassword/changePassword.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [CommonModule, TranslateModule, ChangePasswordRoutingModule, SharedModule],
  declarations: [ChangePasswordComponent]
})
export class ChangePasswordModule {}
