import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { RatingComponent } from '@app/shared/Rating/rating.component';
import { NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { AlertmodalComponent } from '@app/shared/alertModal/alertmodal.component';
import { MessageBarComponent } from '@app/shared/message-bar/message-bar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptorService } from '@app/shared/loader/loaderI-nterceptor-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { InlineEditComponent } from '@app/shared/inline-edit-component/inline-edit.component';
import { FormsModule } from '@angular/forms';
import { TableDataComponent } from '@app/shared/tableData/tableData.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CountryService } from '@app/shared/tableData/tableData.service';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { HotkeyModule } from 'angular2-hotkeys';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HotkeyModule,
    FormsModule,
    Ng2SmartTableModule,
    NgbModule
  ],
  declarations: [
    LoaderComponent,
    RatingComponent,
    AlertmodalComponent,
    MessageBarComponent,
    InlineEditComponent,
    TableDataComponent,
    NgbdSortableHeader
  ],
  providers: [
    NgbRatingConfig,
    CountryService,
    DecimalPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
  ],
  exports: [
    LoaderComponent,
    RatingComponent,
    AlertmodalComponent,
    MessageBarComponent,
    InlineEditComponent,
    TableDataComponent,
    NgbdSortableHeader
  ]
})
export class SharedModule {}
