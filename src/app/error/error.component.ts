import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '@app/shared/loader/loader.service';
import { LoaderState } from '@app/shared';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-error-404',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  error_message: string;
  user_info: any;
  role_type: string;
  error_status = 410;

  constructor(private authenticationService: AuthenticationService) {}

  // @Input() error_status: number;
  ngOnInit() {
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0].substring(0, this.user_info.roles[0].indexOf('_'));
    this.errorType();
  }

  errorType(): void {
    if (this.error_status === 410) {
      this.error_message = 'It seems like has been expired';
    } else {
      this.error_message = "It seems like we couldn't find the page you were looking for";
    }
  }
}
