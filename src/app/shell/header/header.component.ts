import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, I18nService } from '@app/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  user_info: any;
  displaySideBar = true;
  role_type: string;

  @Output() sideBarDisplay = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    this.user_info = JSON.parse(localStorage.getItem('userInfo'));
    this.role_type = this.user_info.role[0].substring(0, this.user_info.role[0].indexOf('_'));
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
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.email : null;
  }

  toggleSideBar(): void {
    this.displaySideBar = !this.displaySideBar;
    console.log('hdsfgsfgfkdfkjg', this.displaySideBar);
    this.sideBarDisplay.emit(this.displaySideBar);
  }
}
