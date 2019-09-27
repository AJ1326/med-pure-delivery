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
// import { ClickOutsideModule } from 'ng-click-outside';
import { ShellComponent } from './shell.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from '@app/shell/footer/footer.component';
import { SidebarComponent } from '@app/shell/sidebar/sidebar.component';
import { BoardingShellComponent } from '@app/shell/boarding/onboardshell.component';
import { OnboardheaderComponent } from '@app/shell/boarding/header/onboardheader.component';
import { OnboardingComponent } from '@app/shell/onboarding/onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { OnboardingService } from '@app/shell/onboarding/onboarding.service';
import { SalesmanheaderComponent } from '@app/shell/salesManShell/header/salesmanheader.component';
import { SalesManShellComponent } from '@app/shell/salesManShell/salesManShell.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { SalesmansidebarComponent } from '@app/shell/salesManShell/sidebar/salesmansidebar.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

@NgModule({
  imports: [
    CommonModule,
    Ng4GeoautocompleteModule.forRoot(),
    TranslateModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DeviceDetectorModule.forRoot()
  ],
  declarations: [
    HeaderComponent,
    ShellComponent,
    FooterComponent,
    SidebarComponent,
    BoardingShellComponent,
    SalesManShellComponent,
    SalesmanheaderComponent,
    SalesmansidebarComponent,
    OnboardheaderComponent,
    OnboardingComponent
  ],
  providers: [NgbAccordionConfig, NgbModalConfig, NgbModal, OnboardingService]
})
export class ShellModule {}
