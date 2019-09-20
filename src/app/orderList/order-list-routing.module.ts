import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { OrderListComponent } from './order-list.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.distributorShell([
    // { path: 'order-list', redirectTo: '/distributor/order-list', pathMatch: 'full' },
    { path: 'order-list', component: OrderListComponent, data: { title: extract('Order list') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class OrderListRoutingModule {}
