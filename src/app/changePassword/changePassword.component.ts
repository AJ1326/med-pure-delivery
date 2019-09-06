import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { LoginService } from '@app/login/login.service';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.html',
  styleUrls: ['./changePassword.scss']
})
export class ChangePasswordComponent implements OnInit {
  isLoading = true;
  password_changed = false;
  form_submitted = false;
  error: any;
  data = {
    new_password1: '',
    new_password2: ''
  };
  constructor(public LoginService: LoginService) {}

  ngOnInit() {}

  change() {
    this.form_submitted = true;
    if (this.data.new_password1 !== this.data.new_password2) {
      return;
    }
    this.password_changed = false;
    this.error = null;
    this.isLoading = true;
    const values = _.cloneDeep(this.data);
    this.LoginService.change_password(values)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.form_submitted = false;
          this.data = {
            new_password1: '',
            new_password2: ''
          };
        })
      )
      .subscribe(
        data => {
          this.password_changed = true;
        },
        error => {
          this.error = error.error.new_password2;
          console.log(this.error);
          // this.error = error;
        }
      );
  }
}
