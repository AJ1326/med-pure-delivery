import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { UploadComponent } from '@app/upload/upload.component';

const routes: Routes = [
  // Shell.retailerShell([{ path: 'upload', component: UploadComponent, data: { title: extract('file upload') } }]),
  Shell.distributorShell([{ path: 'upload', component: UploadComponent, data: { title: extract('file upload') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UploadRoutingModule {}
