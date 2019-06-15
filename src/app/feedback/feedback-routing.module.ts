import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { FeedbackComponent } from './feedback.component';

const routes: Routes = [
  Shell.retailerShell([{ path: 'feedback', component: FeedbackComponent, data: { title: extract('feedback') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class FeedbackRoutingModule {}
