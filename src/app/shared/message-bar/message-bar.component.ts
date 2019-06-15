import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent implements OnInit {
  @Input() messageBarEvent: string;
  constructor(private toastr: ToastrService) {}

  ngOnInit() {
    setTimeout(() => this.showToaster(this.messageBarEvent));
  }

  showToaster(message: string) {
    console.log(message);
    this.toastr.success(message);
  }
}
