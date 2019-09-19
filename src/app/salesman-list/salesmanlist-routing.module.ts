import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { SalesmanlistComponent } from './salesmanlist.component';

const routes: Routes = [
  Shell.retailerShell([
    { path: 'salesman-list', component: SalesmanlistComponent, data: { title: extract('Salesman list') } }
  ]),
  Shell.distributorShell([
    { path: 'salesman-list', component: SalesmanlistComponent, data: { title: extract('Salesman list') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SalesmanlistRoutingModule {}
