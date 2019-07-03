import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { NgbdSortableHeader, SortEvent } from '@app/shared/directives/sortable.directive';
import { Observable } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { Country } from '@app/home/country';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DecimalPipe]
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  countries$: Observable<Country[]>;
  total$: Observable<number>;
  filterCard: string;
  user_info: any = [];
  role_type: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public quoteService: QuoteService) {
    this.countries$ = quoteService.countries$;
    this.total$ = quoteService.total$;
  }

  ngOnInit() {
    this.isLoading = true;
    this.user_info = JSON.parse(localStorage.getItem('userInfo'));
    this.role_type = this.user_info['role'][0].substring(0, this.user_info['role'][0].indexOf('_'));
    console.log(this.role_type);
    const pageURL = window.location.href;
    const lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.quoteService.sortColumn = column;
    this.quoteService.sortDirection = direction;
  }

  selectFilterCard(id_value: string): void {
    const filterCardArray = ['order-list', 're-order-list', 'open-order-list', 'closed-order-list'];
    const index = filterCardArray.indexOf(id_value);
    if (index > -1) {
      filterCardArray.splice(index, 1);
    }
    for (let i = 0; i < filterCardArray.length; i++) {
      const remove_element = document.getElementById(filterCardArray[i]);
      remove_element.classList.remove('active_card');
    }
    const add_element = document.getElementById(id_value);
    add_element.classList.add('active_card');
    this.filterCard = id_value;
  }
}
