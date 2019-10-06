import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ForgetPasswordComponent } from '@app/forgetPassword/home/forgetPassword.component';
import { OnboardingComponent } from '@app/shell/onboarding/onboarding.component';

const routes: Routes = [
  Shell.forgetPasswordShell([
    {
      path: ':id/:id1',
      component: ForgetPasswordComponent
    }
    // { path: '', redirectTo: 'forget-password', pathMatch: 'full' },
    // {
    //   path: 'forget-password',
    //   component: ForgetPasswordComponent,
    //   data: { title: extract('Home') }
    // },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ForgetPasswordRoutingModule {}
