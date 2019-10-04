import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, I18nService } from '@app/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {
  menuHidden = true;
  user_info: any;
  displaySideBar = false;
  role_type: string;
  activeTag: string;

  @Input() sideBarDisplayOverlay: boolean;
  @Output() sideBarDisplay = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private i18nService: I18nService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    let url = window.location.href.replace(/\/$/, ''); /* remove optional end / */
    this.activeTag = url.substr(url.lastIndexOf('/') + 1);
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0];
  }

  ngOnChanges(changes: SimpleChanges) {
    const sideBarDisplayValue: SimpleChange = changes.sideBarDisplayOverlay;
    this.displaySideBar = sideBarDisplayValue.currentValue;
  }

  activeHeaderTag(type: any) {
    this.activeTag = type;
  }

  open(content: any) {
    this.modalService.open(content);
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

  get username(): string | null {
    return this.user_info['name'];
  }

  toggleSideBar(): void {
    this.displaySideBar = !this.displaySideBar;
    this.sideBarDisplay.emit(this.displaySideBar);
  }
}
