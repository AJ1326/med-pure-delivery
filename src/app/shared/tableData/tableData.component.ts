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
  order_list: [];
  isLoading = true;
  alert_message: string;

  //Order data
  @Input() orderListData: any = [];
  @Input() role_type: string;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    public service: TableDataService,
    config: NgbAccordionConfig,
    private modalService: NgbModal,
    private distributorService: PlacingOrderService,
    calendar: NgbCalendar,
    private tableDataService: TableDataService
  ) {
    this.orderlist$ = service.orderlist$;
    this.total$ = service.total$;
    config.closeOthers = true;
    config.type = 'info';
    // this.tableDataService.getOrderList(this.orderListData);
    console.log('role_type', this.orderListData);
    //date
  }

  public openAlertModal(content: any, orderData: any): void {
    this.order_list = orderData;
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private receiveMessage(accept_type: any): void {
    if (accept_type === 'Yes') {
      this.submitOrder(this.order_list);
    }
  }

  private submitOrder(order: any): void {
    order.map((data: any) => {
      delete data['company'];
      delete data['discount'];
      data['distributor'] = data['distributor_slug'];
      data['product'] = data['product_slug'];
      delete data['mrp'];
      delete data['distributor_slug'];
      delete data['product_slug'];
      delete data['pack'];
      delete data['rate'];
      delete data['rating'];
      delete data['pack'];
      delete data['vat'];
      delete data['uuid'];
      data['quantity'] = data['stock'];
      delete data['stock'];
    });
    this.distributorService
      .orderListPlaced(order)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: []) => {
          this.order_list = [];
          this.alert_message = 'Your order has been placed.';
        },
        error => {
          this.alert_message = 'Some error is occurred.';
        }
      );
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
