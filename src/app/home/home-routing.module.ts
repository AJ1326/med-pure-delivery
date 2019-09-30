import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { HomeComponent } from '@app/home/home.component';
import { PlacingOrderComponent } from '@app/placingOrder/placingOrder.component';

const routes: Routes = [
  Shell.retailerShell([
    // {
    //   path: '',
    //   children: [
    //     {
    //       path: '',
    //       redirectTo: 'home',
    //       pathMatch: 'full'
    //     },
    //     {
    //       path: 'home',
    //       component: HomeComponent
    //     }
    //   ]
    // }
    {
      path: 'home',
      component: HomeComponent,
      // children: [
      //   {
      //     path:  'by-distributor',
      //     component:  SalesmanaddRetailerComponent
      //   },
      //   {
      //     path:  'all-orders',
      //     component:  SalesmanaddRetailerComponent
      //   },
      //   {
      //     path:  'pending-orders',
      //     component:  SalesmanaddRetailerComponent
      //   }
      // ],
      data: { title: extract('Home') }
    }
    // { path: '', redirectTo: 'home', pathMatch: 'full' }
  ]),
  Shell.distributorShell([
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: extract('Home') } }
  ]),
  Shell.salesManShell([{ path: 'order-list', component: HomeComponent, data: { title: extract('Order list') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule {}
