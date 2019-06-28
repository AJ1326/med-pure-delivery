import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./siidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  role_type: any;
  user_info: any;

  constructor(private router: Router) {}

  public openOrder(): void {
    this.router.navigate(['/retailer/order'], { replaceUrl: true });
  }

  ngOnInit() {
    this.user_info = JSON.parse(localStorage.getItem('userInfo'));
    this.role_type = this.user_info.role[0].substring(0, this.user_info.role[0].indexOf('_'));
  }
}
