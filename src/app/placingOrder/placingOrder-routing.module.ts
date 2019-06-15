import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { PlacingOrderComponent } from './placingOrder.component';

const routes: Routes = [
  Shell.retailerShell([{ path: 'order', component: PlacingOrderComponent, data: { title: extract('order') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PlacingOrderRoutingModule {}
