import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService, Logger } from '@app/core';
import { BehaviorSubject } from 'rxjs';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { finalize } from 'rxjs/operators';
import { HomeService } from '@app/home/home.service';
import { SalesmanService } from '@app/salesman/salesman.service';

const log = new Logger('Salesman home');

@Component({
  selector: 'app-sales-man-home',
  templateUrl: './salesmanhome.component.html',
  styleUrls: ['./salesmanhome.component.scss'],
  providers: [DecimalPipe]
})
export class SalesmanhomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  // private filterCard = new BehaviorSubject<string>('');
  user_info: any = [];
  role_type: string;
  activeCard: string;
  filterData: any = [];
  error: any;
  filterTitle = '';
  filterValue = '';

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private authenticationService: AuthenticationService,
    private tableservice: TableDataService,
    private salesmanService: SalesmanService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0].substring(0, this.user_info.roles[0].indexOf('_'));
    console.log(this.role_type, 'this.role_type');
    const pageURL = window.location.href;
    const lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
    if (this.role_type === 'retailer') {
    } else {
    }
  }
}
