import { Routes, Route } from '@angular/router';

import {
  AuthenticationBoardingGuard,
  AuthenticationGuard,
  AuthenticationPermissionDistributorGuard,
  AuthenticationPermissionRetailerGuard
} from '@app/core';
import { ShellComponent } from './shell.component';
import { BoardingShellComponent } from '@app/shell/boarding/onboardshell.component';

export class Shell {
  static distributorShell(routes: Routes): Route {
    return {
      path: 'distributor',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard, AuthenticationPermissionDistributorGuard],
      // AuthenticationBoardingGuard
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
  /**
   * Provides helper methods to create routes.
   */
  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return The new route using shell as the base.
   */
  static retailerShell(routes: Routes): Route {
    return {
      path: 'retailer',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard, AuthenticationPermissionRetailerGuard],
      // AuthenticationBoardingGuard
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }

  static onboardingShell(routes: Routes): Route {
    return {
      path: 'boarding',
      component: BoardingShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard, AuthenticationBoardingGuard],
      // AuthenticationBoardingGuard
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}
