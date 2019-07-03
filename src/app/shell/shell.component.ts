import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  sideBarDisplay: boolean;
  master = 'Master';

  constructor() {}

  ngOnInit() {}

  displaySideBar(display: boolean): void {
    console.log('display', display);
    this.sideBarDisplay = display;
  }
}
