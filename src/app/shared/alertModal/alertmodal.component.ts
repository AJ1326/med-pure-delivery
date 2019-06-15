import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alertmodal.component.html',
  styleUrls: ['./alertmodal.component.scss']
})
export class AlertmodalComponent implements OnInit, OnDestroy {
  closeResult: string;

  @Input() alertModalRefference: any;
  @Output() messageEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  public closeAlertModal(content: any) {
    this.alertModalRefference.close();
  }

  public submitAlert(type_alert: any): void {
    this.messageEvent.emit(type_alert);
    this.alertModalRefference.close();
  }
}
