import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { HomeComponent } from './home.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.retailerShell([
    { path: '', redirectTo: '/retailer/home', pathMatch: 'full' },
    {
      path: 'home',
      component: HomeComponent,
      // children: [
      //   {
      //     path:  'by-distributor',
      //     component:  HomeComponent
      //   },
      //   {
      //     path:  'all-orders',
      //     component:  HomeComponent
      //   },
      //   {
      //     path:  'pending-orders',
      //     component:  HomeComponent
      //   }
      // ],
      data: { title: extract('Home') }
    }
  ]),
  Shell.distributorShell([
    { path: '', redirectTo: '/distributor/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { title: extract('Home') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule {}
