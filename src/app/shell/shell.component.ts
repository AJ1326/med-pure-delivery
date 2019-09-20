import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  sideBarDisplay: boolean;
  master = 'Master';
  openNoteBar = false;

  constructor() {}

  ngOnInit() {}

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
