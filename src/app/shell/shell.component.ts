import { Component, OnInit } from '@angular/core';
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
  sideBarDisplay = false;
  master = 'Master';
  openNoteBar = false;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.router.url === '/distributor' || this.router.url === '/retailer' || this.router.url === '/salesman') {
      this.router.navigate([this.router.url, 'home'], { replaceUrl: true });
    }
  }

  hideSidebar(): void {
    this.displaySideBar(false);
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
