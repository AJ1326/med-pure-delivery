import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  sideBarDisplay: boolean;
  master = 'Master';
  openNoteBar = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.router.url);
    if (this.router.url === '/distributor' || this.router.url === '/retailer') {
      this.route.queryParams.subscribe(params => this.router.navigate([this.router.url, 'home'], { replaceUrl: true }));
    }
  }

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
