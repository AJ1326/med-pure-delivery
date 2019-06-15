import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list-retailer.component.html',
  styleUrls: ['./order-list-retailer.component.scss']
})
export class OrderListRetailerComponent implements OnInit {
  version: string = environment.version;

  constructor() {}

  ngOnInit() {}
}
