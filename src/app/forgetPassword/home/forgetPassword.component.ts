import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService, Logger } from '@app/core';
import { BehaviorSubject } from 'rxjs';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { finalize } from 'rxjs/operators';
import { HomeService } from '@app/home/home.service';
import { SalesmanService } from '@app/salesman/salesman.service';
import * as _ from 'lodash';
import { ForgetPasswordService } from '@app/forgetPassword/forgetPassword.service';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('Salesman home');

@Component({
  selector: 'app-forget-password',
  templateUrl: './forgetPassword.component.html',
  styleUrls: ['./forgetPassword.component.scss'],
  providers: [DecimalPipe]
})
export class ForgetPasswordComponent implements OnInit {
  isLoading = true;
  password_changed = false;
  form_submitted = false;
  error: any;
  data = {
    new_password1: '',
    new_password2: ''
  };
  loading = false;
  verification_code: string;
  verification_number: string;
  inValidToken = false;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private authenticationService: AuthenticationService,
    private forgotService: ForgetPasswordService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.loading = true;
    this.route.params.subscribe(params => {
      this.verification_number = params['id'];
      this.verification_code = params['id1'];
    });
  }

  change() {
    this.form_submitted = true;
    if (this.data.new_password1 !== this.data.new_password2) {
      return;
    }
    this.password_changed = false;
    this.error = null;
    this.isLoading = true;
    const values = _.cloneDeep(this.data);
    this.forgotService
      .forgot_password(values, this.verification_number, this.verification_code)
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
          if (error.error.uid || error.error.token) {
            this.inValidToken = true;
          } else {
            this.inValidToken = false;
          }
        }
      );
  }
}
