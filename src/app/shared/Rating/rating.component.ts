import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() rating: number;
  // @Input() itemId: number;
  // @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();

  inputName: string;

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    // this.inputName = this.itemId + '_rating';
  }

  counter(i: number) {
    return new Array(i);
  }

  // onClick(rating: number): void {
  //   this.rating = rating;
  //   this.ratingClick.emit({
  //     itemId: this.itemId,
  //     rating: rating
  //   });
  // }
}
