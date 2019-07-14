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
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { OrderList } from '@app/shared/Interfaces/tableData';
import {
  ModalDismissReasons,
  NgbAccordionConfig,
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { PlacingOrderService } from '@app/placingOrder/placingOrder.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OrderListService } from '@app/orderList/order-list.service';

@Component({
  selector: 'app-table',
  templateUrl: './tableData.component.html',
  styleUrls: ['./tableData.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableDataComponent implements OnInit, OnDestroy {
  disabled = false;
  closeResult: string;
  orderlist$: Observable<OrderList[]>;
  total$: Observable<number>;
  modalReference: any;
  isLoading = true;
  alert_message: string;
  orderListDataFilter: any;
  rejectOrderModel: any;

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
    calendar: NgbCalendar,
    public tableDataService: TableDataService
  ) {
    tableDataService.orderlist$.subscribe((data: any) => {
      this.orderListData = data;
    });

    console.log('fuck you:  ', this.orderListData);
    this.total$ = tableDataService.total$;
    config.closeOthers = true;
    config.type = 'info';
    //  this.tableDataService.getOrderList(this.orderListData);
    console.log('role_type', this.orderListData);
    //  date
  }

  ngOnInit() {}

  ngOnDestroy(): void {}

  open(content: any, data?: any) {
    this.orderListDataFilter = data;
    console.log('this.reOrderList:', this.orderListDataFilter);
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
      console.log('data', data);
      this.JSONToCSVConvertor(data, 'Todays order list', true);
    });
  }

  JSONToCSVConvertor(JSONData: [], ReportTitle: string, ShowLabel: boolean) {
    //  If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    const arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

    let CSV = ',' + '\r\n\n';

    //  This condition will generate the Label/Header
    if (ShowLabel) {
      let row = '';

      //  This loop will extract the label from 1st index of on array
      for (let index in arrData[0]) {
        //  Now convert each value to string and comma-seprated
        row += index + ',';
      }

      row = row.slice(0, -1);

      // append Label row with line break
      CSV += row + '\r\n';
    }

    // 1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      let row = '';

      // 2nd loop will extract each column and convert it in string comma-seprated
      for (let index in arrData[i]) {
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
    let fileName = 'orderListMedpure_';
    // this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, '_');

    // Initialize file format you want csv or xls
    let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    //  Now the little tricky part.
    //  you can use either>> window.open(uri);
    //  but this will not work in some browsers
    //  or you will not get the correct file extension

    // this trick will generate a temp <a /> tag
    let link = document.createElement('a');
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

  //  private receiveMessage(accept_type: any): void {
  //    if (accept_type === 'Yes') {
  //      this.submitOrder();
  //    }
  //  }

  //  private submitOrder(order: any): void {
  //    order.map((data: any) => {
  //      delete data['company'];
  //      delete data['discount'];
  //      data['distributor'] = data['distributor_slug'];
  //      data['product'] = data['product_slug'];
  //      delete data['mrp'];
  //      delete data['distributor_slug'];
  //      delete data['product_slug'];
  //      delete data['pack'];
  //      delete data['rate'];
  //      delete data['rating'];
  //      delete data['pack'];
  //      delete data['vat'];
  //      delete data['uuid'];
  //      data['quantity'] = data['stock'];
  //      delete data['stock'];
  //    });
  //    this.distributorService
  //      .orderListPlaced(order)
  //      .pipe(
  //        finalize(() => {
  //          this.isLoading = false;
  //        })
  //      )
  //      .subscribe(
  //        (data: []) => {
  //          //  this.reOrderList = [];
  //          this.alert_message = 'Your order has been placed.';
  //        },
  //        error => {
  //          this.alert_message = 'Some error is occurred.';
  //        }
  //      );
  //  }
  //
  //  private OrderList(): void {
  //    this.tableDataService._search();
  //      //  .pipe(
  //      //    finalize(() => {
  //      //      this.isLoading = false;
  //      //    })
  //      //  )
  //      //  .subscribe(
  //      //    (data: []) => {
  //      //      this.retailorderList = data['results'];
  //      //      this.pageCount = data['results'];
  //      //      console.log(this.retailorderList);
  //      //      this.success_message = 'Your order has been placed.';
  //      //    },
  //      //    (error: any) => {
  //      //      //  log.debug(`Login error: ${error}`);
  //      //      this.error = error;
  //      //      this.success_message = 'Some error is occurred.';
  //      //    }
  //      //  );
  //  }
}
