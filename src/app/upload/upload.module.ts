import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { UploadComponent } from '@app/upload/upload.component';
import { UploadService } from '@app/upload/upload.service';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule],
  declarations: [UploadComponent],
  providers: [UploadService]
})
export class UploadModule {}
