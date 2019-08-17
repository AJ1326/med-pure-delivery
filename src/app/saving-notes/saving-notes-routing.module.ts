import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { SavingNotesComponent } from './saving-notes.component';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  // Shell.retailerShell([{ path: 'notes', component: SavingNotesComponent, data: { title: extract('Notes') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SavingNotesRoutingModule {}
