import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesmanlistService } from './salesmanlist.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core';

@Component({
  selector: 'app-salesman-list',
  templateUrl: './salesmanlist.component.html',
  styleUrls: ['./salesmanlist.component.scss']
})
export class SalesmanlistComponent implements OnInit {
  version: string = environment.version;
  closeResult: string;
  searchID = '';
  salesmanList = [];
  connectedSalesmanList = [];
  role_type: any;
  user_info: any;

  constructor(
    private modalService: NgbModal,
    private salesmanlistService: SalesmanlistService,
    private toastr: ToastrService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getConnectedSalesman();
    this.user_info = this.authenticationService.userInfo();
    this.role_type = this.user_info.roles[0];
  }

  navigateToAddSalesman() {
    this.modalService.dismissAll();
    this.router.navigate(['/' + this.role_type + '/add-salesman'], { replaceUrl: true });
  }

  getConnectedSalesman() {
    this.salesmanlistService.getConnectedSalesman().subscribe((data: any) => {
      this.connectedSalesmanList = data.results;
    });
  }

  searchSalesmanViaID() {
    this.salesmanlistService.getSalesmanViaID(this.searchID).subscribe(data => {
      this.salesmanList = data['results'];
      console.log(data);
    });
  }

  connectSalesman(salesman_id: string) {
    this.salesmanlistService
      .connectSalesman({
        user_id: salesman_id
      })
      .subscribe(
        (data: any) => {
          console.log(data);
          this.toastr.success(data.success);
          this.searchID = '';
          this.salesmanList = [];
          this.modalService.dismissAll();
        },
        (error: any) => {
          this.toastr.error(error.error.error);
        }
      );
  }

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
