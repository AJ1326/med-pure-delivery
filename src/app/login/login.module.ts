import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginService } from '@app/login/login.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, NgbModule, LoginRoutingModule],
  declarations: [LoginComponent],
  providers: [LoginService]
})
export class LoginModule {}
