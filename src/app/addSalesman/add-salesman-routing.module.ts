import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { AddSalesmanComponent } from './add-salesman.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.distributorShell([
    { path: 'add-salesman', component: AddSalesmanComponent, data: { title: extract('Add Salesman') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AddSalesmanRoutingModule {}
