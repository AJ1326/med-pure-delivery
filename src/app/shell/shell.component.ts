import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService, Logger } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';

const log = new Logger('Shell');
const credentialsKey = 'credentials';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  sideBarDisplay: boolean;
  master = 'Master';
  openNoteBar = false;

  // constructor(private router: Router, private route: ActivatedRoute) {}

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    console.log(this.router.url);
    if (this.router.url === '/distributor' || this.router.url === '/retailer' || this.router.url === '/salesman') {
      this.router.navigate([this.router.url, 'home'], { replaceUrl: true });
    }
  }

  // ngOnInit() {
  //   const role = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
  //   if (role) {
  //     const roleType = this.authenticationService.permissionView();
  //     console.log('roleType', roleType);
  //     if (roleType === 'retailer') {
  //       this.route.queryParams.subscribe(params => this.router.navigate(['/retailer/home'], { replaceUrl: true }));
  //     } else if (roleType === 'distributor') {
  //       this.route.queryParams.subscribe(params => this.router.navigate(['/distributor/home'], { replaceUrl: true }));
  //     } else if (roleType === 'salesman') {
  //       this.route.queryParams.subscribe(params => this.router.navigate(['/salesman'], { replaceUrl: true }));
  //     } else {
  //       this.route.queryParams.subscribe(params => this.router.navigate([params.redirect || ''], { replaceUrl: true }));
  //     }
  //   } else {
  //     this.route.queryParams.subscribe(params => this.router.navigate([params.redirect || ''], { replaceUrl: true }));
  //   }
  // }

  onClickedOutside(e: Event) {
    console.log(e, 'Event value');
    // this.openNoteBar = false;
  }

  displaySideBar(display: boolean): void {
    this.sideBarDisplay = display;
  }

  openNotes(): void {
    this.openNoteBar = true;
  }

  closeNotes(): void {
    this.openNoteBar = false;
  }
}
