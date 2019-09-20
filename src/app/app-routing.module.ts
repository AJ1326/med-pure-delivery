import { NgModule } from '@angular/core';
import { Routes, RouterModule, Route, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { HomeComponent } from '@app/home/home.component';
import { OrderListComponent } from '@app/orderList/order-list.component';
import {
  AuthenticationGuard,
  AuthenticationPermissionDistributorGuard,
  AuthenticationPermissionRetailerGuard
} from '@app/core';
import { OnboardingComponent } from './shell/onboarding/onboarding.component';

const routes: Routes = [
  // Shell.distributorShell([
  //   {
  //     path: 'distributor',
  //     component: OrderListComponent,
  //   },
  // ]),
  Shell.onboardingShell([
    {
      path: ':id',
      component: OnboardingComponent
    }
  ]),
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
