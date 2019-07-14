import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ChangePasswordComponent } from '@app/changePassword/changePassword.component';

const routes: Routes = [
  Shell.retailerShell([
    { path: 'change-password', component: ChangePasswordComponent, data: { title: extract('Change Password') } }
  ]),
  Shell.distributorShell([
    { path: 'change-password', component: ChangePasswordComponent, data: { title: extract('Change Password') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ChangePasswordRoutingModule {}
