import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { HomeComponent } from '@app/home/home.component';
import { SalesmanhomeComponent } from '@app/salesman/home/salesmanhome.component';
import { SalesmanretailerListComponent } from '@app/salesman/retailerList/salesmanretailerList.component';
import { SalesmanaddRetailerComponent } from '@app/salesman/addRetailer/salesmanaddRetailer.component';

const routes: Routes = [
  Shell.salesManShell([
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
      path: 'home',
      component: SalesmanhomeComponent,
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
    },
    {
      path: 'retailer-list',
      component: SalesmanretailerListComponent,
      data: { title: extract('Retailer list'), list_type: 'retailer_list' }
    },
    {
      path: 'distributor-list',
      component: SalesmanretailerListComponent,
      data: { title: extract('Distributor list'), list_type: 'distributor_list' }
    },
    {
      path: 'add-retailer',
      component: SalesmanaddRetailerComponent,
      data: { title: extract('Add retailer') }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SalesmanRoutingModule {}
