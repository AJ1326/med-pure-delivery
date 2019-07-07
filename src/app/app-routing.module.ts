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
import { BoardingShellComponent } from '@app/shell/boarding/onboardshell.component';

const routes: Routes = [
  // Shell.distributorShell([
  //   {
  //     path: 'distributor',
  //     component: OrderListComponent,
  //   },
  // ]),
  Shell.onboardingShell([
    {
      path: 'boarding',
      component: BoardingShellComponent
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
