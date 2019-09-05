import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { RatingComponent } from '@app/shared/Rating/rating.component';
import { NgbModule, NgbRatingConfig, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { AlertmodalComponent } from '@app/shared/alertModal/alertmodal.component';
import { MessageBarComponent } from '@app/shared/message-bar/message-bar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptorService } from '@app/shared/loader/loaderI-nterceptor-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { InlineEditComponent } from '@app/shared/inline-edit-component/inline-edit.component';
import { FormsModule } from '@angular/forms';
import { ChangeDateFormat, TableDataComponent } from '@app/shared/tableData/tableData.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { HotkeyModule } from 'angular2-hotkeys';
import { ComingSoonModule } from '@app/coming-soon/coming-soon.module';
// import {AppRoutingModule} from "@app/app-routing.module";

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HotkeyModule,
    FormsModule,
    // AppRoutingModule,
    ComingSoonModule,
    Ng2SmartTableModule,
    NgbModule
  ],
  declarations: [
    LoaderComponent,
    RatingComponent,
    ChangeDateFormat,
    AlertmodalComponent,
    MessageBarComponent,
    InlineEditComponent,
    TableDataComponent,
    NgbdSortableHeader
  ],
  providers: [
    NgbRatingConfig,
    TableDataService,
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
    NgbdSortableHeader,
    FormsModule,
    NgbModule
  ]
})
export class SharedModule {}
