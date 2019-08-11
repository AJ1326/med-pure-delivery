import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import {
  NgbAccordionConfig,
  NgbDateParserFormatter,
  NgbModal,
  NgbModalConfig,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from '@app/shell/footer/footer.component';
import { SidebarComponent } from '@app/shell/sidebar/sidebar.component';
import { BoardingShellComponent } from '@app/shell/boarding/onboardshell.component';
import { OnboardheaderComponent } from '@app/shell/boarding/header/onboardheader.component';
import { OnboardingComponent } from '@app/shell/onboarding/onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule
  ],
  declarations: [
    HeaderComponent,
    ShellComponent,
    FooterComponent,
    SidebarComponent,
    BoardingShellComponent,
    OnboardheaderComponent,
    OnboardingComponent
  ],
  providers: [NgbAccordionConfig, NgbModalConfig, NgbModal]
})
export class ShellModule {}
