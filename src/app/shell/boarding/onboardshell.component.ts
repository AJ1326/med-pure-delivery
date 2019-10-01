import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-on-board-shell',
  templateUrl: './onboardshell.component.html',
  styleUrls: ['./onboardshell.component.scss']
})
export class BoardingShellComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    console.log(this.router.url);
    if (this.router.url === '/boarding') {
      this.router.navigate(['login'], { replaceUrl: true });
    }
  }
}
