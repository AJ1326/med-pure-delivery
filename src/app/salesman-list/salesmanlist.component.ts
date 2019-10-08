import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-salesman-list',
  templateUrl: './salesmanlist.component.html',
  styleUrls: ['./salesmanlist.component.scss']
})
export class SalesmanlistComponent implements OnInit {
  version: string = environment.version;
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  public openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
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
}
