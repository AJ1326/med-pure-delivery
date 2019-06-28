import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  Shell.retailerShell([{ path: 'profile', component: ProfileComponent, data: { title: extract('Profile') } }]),
  Shell.distributorShell([{ path: 'profile', component: ProfileComponent, data: { title: extract('Profile') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProfileRoutingModule {}
