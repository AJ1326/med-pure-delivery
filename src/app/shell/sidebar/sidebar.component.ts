import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./siidebar.component.scss']
})
export class SidebarComponent implements OnChanges, OnInit {
  role_type: any;
  user_info: any;
  displaySideBar: boolean;

  @Input() sideBarDisplay: boolean;

  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  public openOrder(redirectUrl: string): void {
    this.router.navigate(['/retailer/' + redirectUrl], { replaceUrl: true });
  }

  logout(): void {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  ngOnChanges(changes: SimpleChanges) {
    const sideBarDisplayValue: SimpleChange = changes.sideBarDisplay;
    this.displaySideBar = sideBarDisplayValue.currentValue;
    console.log(this.displaySideBar, 'displaySideBar');
  }

  ngOnInit() {
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0].substring(0, this.user_info.roles[0].indexOf('_'));
  }
}
