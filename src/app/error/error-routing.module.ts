import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ErrorComponent } from '@app/error/error.component';

const routes: Routes = [
  Shell.retailerShell([{ path: 'error', component: ErrorComponent, data: { title: extract('error') } }]),
  Shell.distributorShell([{ path: 'error', component: ErrorComponent, data: { title: extract('error') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ErrorRoutingModule {}
