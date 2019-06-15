import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FeedbackRoutingModule],
  declarations: [FeedbackComponent]
})
export class FeedbackModule {}
