import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { environment } from '@env/environment';
import {
  AuthenticationBoardingGuard,
  AuthenticationPermissionDistributorGuard,
  AuthenticationPermissionRetailerGuard,
  CoreModule
} from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PlacingOrderModule } from '@app/placingOrder/placingOrder.module';
import { ChangePasswordModule } from '@app/changePassword/changePassword.module';
import { OrderListRoutingModule } from '@app/orderList/order-list-routing.module';
import { HotkeyModule } from 'angular2-hotkeys';
import { OrderListRetailerRoutingModule } from '@app/order-list-retailer/order-list-retailer-routing.module';
import { CookieService } from 'ngx-cookie-service';
import { ProfileModule } from '@app/profile/profile.module';
import { ProfileRoutingModule } from '@app/profile/profile-routing.module';
import { FeedbackModule } from '@app/feedback/feedback.module';
import { OrderListModule } from '@app/orderList/order-list.module';
import { HomeRoutingModule } from '@app/home/home-routing.module';
import { ComingSoonModule } from '@app/coming-soon/coming-soon.module';
import { ComingSoonRoutingModule } from '@app/coming-soon/coming-soon-routing.module';
import { UploadModule } from '@app/upload/upload.module';
import { UploadRoutingModule } from '@app/upload/upload-routing.module';
import { PlacingOrderRoutingModule } from '@app/placingOrder/placingOrder-routing.module';
import { AboutRoutingModule } from '@app/about/about-routing.module';
import { PwaService } from '@app/pwa.service';
import { SavingNotesRoutingModule } from '@app/saving-notes/saving-notes-routing.module';
import { SavingNotesModule } from '@app/saving-notes/saving-notes.module';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    HotkeyModule.forRoot(),
    TranslateModule.forRoot(),
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    HomeModule,
    AboutModule,
    FeedbackModule,
    OrderListRoutingModule,
    OrderListRetailerRoutingModule,
    OrderListModule,
    LoginModule,
    PlacingOrderModule,
    ProfileModule,
    UploadModule,
    SavingNotesModule,
    ComingSoonModule,
    ProfileRoutingModule,
    UploadRoutingModule,
    AboutRoutingModule,
    ComingSoonRoutingModule,
    PlacingOrderRoutingModule,
    SavingNotesRoutingModule,
    HomeRoutingModule,
    ChangePasswordModule, // must be imported as the last module as it contains the fallback route,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
    AuthenticationPermissionRetailerGuard,
    AuthenticationPermissionDistributorGuard,
    AuthenticationBoardingGuard,
    CookieService,
    PwaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
