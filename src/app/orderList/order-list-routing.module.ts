import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { OrderListComponent } from './order-list.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.distributorShell([
    { path: '', redirectTo: '/distributor/home', pathMatch: 'full' },
    { path: 'home', component: OrderListComponent, data: { title: extract('Order list') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class OrderListRoutingModule {}
