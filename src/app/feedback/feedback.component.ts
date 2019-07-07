import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeedbackComponent implements OnInit {
  version: string = environment.version;

  constructor() {}

  ngOnInit() {}
}
