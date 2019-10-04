import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
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
  text = '';

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
  }

  ngOnInit() {
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0];
  }
}
