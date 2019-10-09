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
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader } from '@app/shared/directives/sortable.directive';
import { TableDataService } from '@app/shared/tableData/tableData.service';
import { ModalDismissReasons, NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderListService } from '@app/orderList/order-list.service';
import { AuthenticationService } from '@app/core';
import { HomeService } from '@app/home/home.service';
import { finalize } from 'rxjs/operators';
import { mapValues } from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Pipe({ name: 'changeDateFormat' })
export class ChangeDateFormat implements PipeTransform {
  transform(value: string): string {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(value);
    const secondDate = new Date();
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
export class TableDataComponent implements OnInit, OnDestroy {
  disabled = false;
  closeResult: string;
  total$: Observable<number>;
  orderListDataFilter: any;
  rejectOrderModel: any;
  filter_type: string | null = null;
  user_info: any;
  orderListData_sub: any;
  message: string;
  filter_type_sub: any;
  modalReference: any;
  order_selected_box_status: any = {};
  order_selected_box_status_value = 'none';

  // pendingMedicineDate: any;

  //  Order data
  orderListData: any = [];
  @Input() role_type: string;
  @Input() startDate: string;
  @Input() endDate: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  @Output() accept_all_csv_downloaded = new EventEmitter<boolean>();

  constructor(
    config: NgbAccordionConfig,
    private modalService: NgbModal,
    private orderListService: OrderListService,
    public tableDataService: TableDataService,
    public authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private homeService: HomeService
  ) {
    this.filter_type_sub = tableDataService.filterTypeValue.subscribe(value => {
      this.filter_type = value;
    });
    this.orderListData_sub = tableDataService.orderlist$.subscribe((data: any) => {
      data.forEach(element => {
        if (element.status === 'in_process') {
          this.order_selected_box_status[element.order_id.toString()] = false;
        }
      });
      this.orderListData = data;
      this.order_selected_box_status_value = 'all';
      this.toggle_overall_check_status();
    });

    this.total$ = tableDataService.total$;
    config.closeOthers = true;
    config.type = 'info';
  }

  modal_reply_function: any = function(content: any) {};

  ngOnInit() {
    this.user_info = this.authenticationService.userInfo();
  }

  ngOnDestroy(): void {
    this.orderListData_sub.unsubscribe();
    this.filter_type_sub.unsubscribe();
  }

  open(content: any, data?: any) {
    this.orderListDataFilter = data;
    this.rejectOrderModel = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  isTrue(element: any) {
    return element === true;
  }

  toggle_overall_check_status() {
    if (this.order_selected_box_status_value === 'partial') {
      this.order_selected_box_status_value = 'none';
      this.order_selected_box_status = mapValues(this.order_selected_box_status, function(o: any) {
        return false;
      });
    } else if (this.order_selected_box_status_value === 'all') {
      this.order_selected_box_status_value = 'none';
      this.order_selected_box_status = mapValues(this.order_selected_box_status, function(o: any) {
        return false;
      });
    } else if (this.order_selected_box_status_value === 'none') {
      this.order_selected_box_status_value = 'all';
      this.order_selected_box_status = mapValues(this.order_selected_box_status, function(o: any) {
        return true;
      });
    }
  }

  toggle_select_order(order_id: string) {
    this.order_selected_box_status[order_id] = !this.order_selected_box_status[order_id];

    const status_values = Object.values(this.order_selected_box_status);

    if (status_values.some(this.isTrue)) {
      if (status_values.every(this.isTrue)) {
        this.order_selected_box_status_value = 'all';
      } else {
        this.order_selected_box_status_value = 'partial';
      }
    } else {
      this.order_selected_box_status_value = 'none';
    }
  }

  accept_orders(accept_type: any) {
    if (accept_type === 'Yes') {
      const data = {
        orders: this.get_selected_orders_list(),
        status: 'accepted_by_distributor'
      };
      this.tableDataService.changeOrderStatus(data).subscribe(
        (data2: any) => {
          this.message = 'You have accepted the orders.';
          this.toastr.success(this.message);
          this.accept_all_csv_downloaded.emit(true);
          this.tableDataService._search();
        },
        error => {
          console.log(`Login error: ${error}`);
          this.message = 'Some error is occurred.';
          this.toastr.error(this.message);
        }
      );
    } else {
      this.order_selected_box_status_value = 'all';
      this.toggle_overall_check_status();
    }
  }

  accept_orders_confirmation(content: any) {
    this.modal_reply_function = this.accept_orders;
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  reject_orders(accept_type: any) {
    if (accept_type === 'Yes') {
      const data = {
        orders: this.get_selected_orders_list(),
        status: 'rejected_by_distributor'
      };
      this.tableDataService.changeOrderStatus(data).subscribe(
        (data2: any) => {
          this.message = 'You have rejected the orders.';
          this.toastr.success(this.message);
          this.accept_all_csv_downloaded.emit(true);
          this.tableDataService._search();
        },
        error => {
          console.log(`Login error: ${error}`);
          this.message = 'Some error is occurred.';
          this.toastr.error(this.message);
        }
      );
    } else {
      this.order_selected_box_status_value = 'all';
      this.toggle_overall_check_status();
    }
  }

  reject_orders_confirmation(content: any) {
    this.modal_reply_function = this.reject_orders;
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  get_selected_orders_list() {
    const checked_order_list = [];
    for (let order_id in this.order_selected_box_status) {
      if (this.order_selected_box_status[order_id]) {
        checked_order_list.push(order_id);
      }
    }
    return checked_order_list;
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

  downloadInvoiceByRetailer(slug: any, uuid: string): void {
    this.orderListService.downloadBatchRetailerProductList(slug, uuid).subscribe((data: any) => {
      this.JSONToCSVConvertor(data, 'Invoice', true);
    });
  }

  downloadBatchByRetailer(uuid: string, event: any): void {
    event.stopPropagation();
    this.orderListService.downloadBatchRetailerList(uuid).subscribe((data: any) => {
      this.JSONToCSVConvertor(data, 'Batch', true);
    });
  }

  downLoadOrders(): void {
    this.orderListService.acceptPendingOrderList().subscribe((data: any) => {
      this.homeService.cardListData(this.role_type);
      this.tableDataService._search();
      this.accept_all_csv_downloaded.emit(true);
    });
    this.orderListService.downloadPendingProductList().subscribe((data: any) => {
      this.JSONToCSVConvertor(data, 'Orders', true);
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
