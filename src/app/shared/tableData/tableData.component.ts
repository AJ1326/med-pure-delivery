import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChildren,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from '@app/shared/directives/sortable.directive';
import { CountryService } from '@app/shared/tableData/tableData.service';
import { OrderList } from '@app/shared/Interfaces/tableData';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-table',
  templateUrl: './tableData.component.html',
  styleUrls: ['./tableData.component.scss'],
  providers: [NgbAccordionConfig],
  encapsulation: ViewEncapsulation.None
})
export class TableDataComponent implements OnInit, OnDestroy {
  disabled = false;

  orderlist$: Observable<OrderList[]>;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(public service: CountryService, config: NgbAccordionConfig) {
    this.orderlist$ = service.orderlist$;
    this.total$ = service.total$;
    config.closeOthers = true;
    config.type = 'info';
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  ngOnInit() {}

  ngOnDestroy(): void {}
}
