import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService } from '@app/core';
import { BehaviorSubject } from 'rxjs';
import { TableDataService } from '@app/shared/tableData/tableData.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DecimalPipe]
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  // private filterCard = new BehaviorSubject<string>('');
  user_info: any = [];
  role_type: string;
  activeCard: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(private authenticationService: AuthenticationService, private tableservice: TableDataService) {}

  ngOnInit() {
    this.isLoading = true;
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0].substring(0, this.user_info.roles[0].indexOf('_'));
    const pageURL = window.location.href;
    const lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
    this.tableservice.SetfilterTypeValue('all-order-list');
    //
    // this.tableservice.filterTypeValue.subscribe((data: any) => {
    //   if (data) {
    //     console.log('------------------->: ', data, typeof data);
    this.selectFilterCard('all-order-list');
    //   }
    // });
  }

  selectFilterCard(id_value: string, send_to_service?: true): void {
    console.log('selectFilterCard', id_value);
    this.activeCard = id_value;
    // const filterCardArray = ['all-order-list', 'pending-order-list', 'by-source', 'fast-moving-order-list'];
    // const index = filterCardArray.indexOf(id_value);
    // if (index > -1) {
    //   console.log('index', index);
    //   filterCardArray.splice(index, 1);
    // }
    // console.log('filterCardArray', filterCardArray);
    // for (let i = 0; i < filterCardArray.length; i++) {
    //   // const remove_element = ;
    //   const remove_element: HTMLElement | null = document.getElementById(filterCardArray[i])!;
    //   console.log('remove_element', remove_element);
    //   remove_element.classList.remove('active_card');
    //   // remove_element ? remove_element.classList.remove('active_card') : console.log('hh') ;
    // }
    // const add_element = document.getElementById(id_value);
    // add_element.classList.add('active_card');
    // add_element ? add_element.classList.add('active_card') :  console.log('hh') ;
    // if (send_to_service) {
    this.tableservice.SetfilterTypeValue(id_value);
    // }
  }
}
