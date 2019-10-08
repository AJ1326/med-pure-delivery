import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-on-board-shell',
  templateUrl: './salesManShell.component.html',
  styleUrls: ['./salesManShell.component.scss']
})
export class SalesManShellComponent implements OnInit {
  isDesktop = false;
  master = 'Master';
  openNoteBar = false;

  @Input() sideBarDisplay: boolean;

  constructor(private deviceService: DeviceDetectorService) {}

  ngOnInit() {
    this.checkDeviceType();
  }

  hideSidebar(): void {
    this.displaySideBar(false);
  }

  displaySideBar(display: boolean): void {
    this.sideBarDisplay = display;
  }

  checkDeviceType(): void {
    // For detecting mobile and tablet view
    // const isMobile = this.deviceService.isMobile();
    // const isTablet = this.deviceService.isTablet();
    this.isDesktop = this.deviceService.isDesktop();
    console.log('this.isDesktop', this.isDesktop);
  }
}
