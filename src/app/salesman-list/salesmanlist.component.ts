import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-salesman-list',
  templateUrl: './salesmanlist.component.html',
  styleUrls: ['./salesmanlist.component.scss']
})
export class SalesmanlistComponent implements OnInit {
  version: string = environment.version;

  constructor() {}

  ngOnInit() {}
}
