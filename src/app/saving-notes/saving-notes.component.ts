import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '@env/environment';

@Component({
  selector: 'app-saving-notes',
  templateUrl: './saving-notes.component.html',
  styleUrls: ['./saving-notes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SavingNotesComponent implements OnInit {
  version: string = environment.version;
  isLoading: false;
  error: string;
  titles: any = [];
  texts: any = [];

  constructor() {}

  newTitle(): void {
    let name = 'Title' + this.titles.length;

    if (name !== 'Title0') {
      this.newHeading();
      // end;
    }

    let newTitle = document.createElement('input');
    newTitle.setAttribute('type', 'text');
    newTitle.setAttribute('placeholder', name);
    newTitle.classList.add('title');
    // newTitle.setAttribute("class", "title");
    newTitle.setAttribute('id', name);
    let workSpace = document.getElementById('workSpace');
    this.titles.push(name);

    workSpace.appendChild(newTitle);
    document.getElementById(name).focus();
  }

  newHeading(): void {
    let name = 'Title' + this.titles.length;

    let newTitle = document.createElement('input');
    newTitle.setAttribute('type', 'text');
    newTitle.setAttribute('placeholder', name);
    newTitle.classList.add('def');
    // newTitle.setAttribute("class", "def");
    newTitle.setAttribute('id', name);
    let workSpace = document.getElementById('workSpace');
    this.titles.push(name);
    workSpace.appendChild(newTitle);
    document.getElementById(name).focus();
  }

  newText(): void {
    let name = 'Text' + this.texts.length;

    let newTitle = document.createElement('textarea');
    newTitle.setAttribute('placeholder', name);
    newTitle.classList.add('text');
    // newTitle.setAttribute("class", "text");
    newTitle.setAttribute('id', name);
    let workSpace = document.getElementById('workSpace');
    this.texts.push(name);

    workSpace.appendChild(newTitle);
    document.getElementById(name).focus();
  }

  ngOnInit() {}
}
