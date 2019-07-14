import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { environment } from '@env/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {
  version: string = environment.version;
  text = ['WELCOME', 'TO', 'THE', 'CITY'];
  counter = 0;
  elem = document.getElementById('txt');
  inst = setInterval(this.change, 1500);

  constructor() {}

  ngOnInit() {
    this.change();
  }

  change() {
    this.elem.innerHTML = this.text[this.counter];
    this.counter++;
    if (this.counter >= this.text.length) {
      this.counter = 0;
    }
  }
}
