import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { AboutComponent } from './about.component';

const routes: Routes = [
  Shell.retailerShell([{ path: 'about-us', component: AboutComponent, data: { title: extract('about-us') } }]),
  Shell.distributorShell([{ path: 'about-us', component: AboutComponent, data: { title: extract('bout-us') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AboutRoutingModule {}
