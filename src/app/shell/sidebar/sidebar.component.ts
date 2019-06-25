import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./siidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) {}

  public openOrder(): void {
    this.router.navigate(['/retailer/order'], { replaceUrl: true });
  }

  ngOnInit() {}
}
