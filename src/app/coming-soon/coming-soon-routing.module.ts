import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ComingSoonComponent } from '@app/coming-soon/coming-soon.component';

const routes: Routes = [
  Shell.retailerShell([
    { path: 'coming-soon', component: ComingSoonComponent, data: { title: extract('coming-soon') } }
  ]),
  Shell.distributorShell([
    { path: 'coming-soon', component: ComingSoonComponent, data: { title: extract('coming-soon') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ComingSoonRoutingModule {}
