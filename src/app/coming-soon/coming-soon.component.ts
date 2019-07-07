import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComingSoonComponent implements OnInit {
  version: string = environment.version;

  constructor() {}

  ngOnInit() {}
}
