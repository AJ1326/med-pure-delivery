import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { OrderListRetailerComponent } from './order-list-retailer.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.retailerShell([
    { path: 'order-list', component: OrderListRetailerComponent, data: { title: extract('Order list') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class OrderListRetailerRoutingModule {}
