import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, ProfileRoutingModule],
  declarations: [ProfileComponent]
})
export class ProfileModule {}
