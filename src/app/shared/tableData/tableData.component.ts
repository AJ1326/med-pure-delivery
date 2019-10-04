import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChildren,
  QueryList,
  ViewEncapsulation,
  Pipe,
  PipeTransform,
  AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { ModalDismissReasons, NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderListService } from '@app/orderList/order-list.service';
import { AuthenticationService } from '@app/core';
import { HomeService } from '@app/home/home.service';
import { finalize } from 'rxjs/operators';

@Pipe({ name: 'changeDateFormat' })
export class ChangeDateFormat implements PipeTransform {
  transform(value: string): string {
    console.log(value, 'value');
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(value);
    const secondDate = new Date();
    console.log(firstDate.getTime(), 'firstDate.getTime()');
    console.log(secondDate.getTime(), 'secondDate.getTime()');
    const pendingMedicineDate = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
    return pendingMedicineDate.toString();
  }
}

@Component({
  selector: 'app-table',
  templateUrl: './tableData.component.html',
  styleUrls: ['./tableData.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableDataComponent implements OnInit {
  disabled = false;
  closeResult: string;
  total$: Observable<number>;
  orderListDataFilter: any;
  rejectOrderModel: any;
  filter_type = 'all-order-list';
  user_info: any;
  // pendingMedicineDate: any;

  //  Order data
  orderListData: any = [];
  @Input() role_type: string;
  @Input() startDate: string;
  @Input() endDate: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    config: NgbAccordionConfig,
    private modalService: NgbModal,
    private orderListService: OrderListService,
    public tableDataService: TableDataService,
    public authenticationService: AuthenticationService,
    private homeService: HomeService
  ) {
    tableDataService.orderlist$.subscribe((data: any) => {
      console.log('orderlist$------->>', data);
      this.orderListData = data;
    });

    tableDataService.filterTypeValue.subscribe(value => {
      console.log('---------d-----d---> ', value);
      this.filter_type = value;
    });

    this.total$ = tableDataService.total$;
    config.closeOthers = true;
    config.type = 'info';
  }

  ngOnInit() {
    this.user_info = this.authenticationService.userInfo();
  }

  open(content: any, data?: any) {
    this.orderListDataFilter = data;
    console.log('this.orderListDataFilter:', this.orderListDataFilter);
    this.rejectOrderModel = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public submitAlert(): void {
    this.orderListService.rejectOrderByDistributor(this.orderListDataFilter).subscribe((data: any) => {
      this.tableDataService._search();
    });
  }

  csvDownload(uuid: string): void {
    this.orderListService.downloadCsvDistributor(uuid).subscribe((data: any) => {
      this.JSONToCSVConvertor(data, 'Todays order list', false);
    });
  }

  downLoadOrders(): void {
    this.orderListService.acceptPendingOrderList().subscribe((data: any) => {
      this.homeService.cardListData(this.role_type);
      this.tableDataService._search();
    });
    this.orderListService.downloadPendingProductList().subscribe((data: any) => {
      this.JSONToCSVConvertor(data, 'Pending_Orders', true);
    });
  }

  JSONToCSVConvertor(JSONData: [], ReportTitle: string, ShowLabel: boolean) {
    //  If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

    let CSV = ',' + '\r\n';

    //  This condition will generate the Label/Header
    if (ShowLabel) {
      let row = '';

      //  This loop will extract the label from 1st index of on array
      for (const index in arrData[0]) {
        //  Now convert each value to string and comma-seprated
        row += index + ',';
      }

      row = row.slice(0, -1);

      // append Label row with line break
      CSV += row + '\r\n';
    }

    // 1st loop is to extract each row
    for (let i = 0; i < arrData.length; i++) {
      let row = '';

      // 2nd loop will extract each column and convert it in string comma-seprated
      for (const index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
      }

      row.slice(0, row.length - 1);

      // add a line break after each row
      CSV += row + '\r\n';
    }

    if (CSV === '') {
      alert('Invalid data');
      return;
    }

    // Generate a file name
    let fileName = 'Medpure_';
    // this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, '_');

    // Initialize file format you want csv or xls
    const uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    //  Now the little tricky part.
    //  you can use either>> window.open(uri);
    //  but this will not work in some browsers
    //  or you will not get the correct file extension

    // this trick will generate a temp <a /> tag
    const link = document.createElement('a');
    link.href = uri;

    // set the visibility hidden so it will not effect on your web-layout
    // @ts-ignore
    link.style = 'visibility:hidden';
    link.download = fileName + '.csv';

    // this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
