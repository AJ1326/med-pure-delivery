import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '@app/shared/loader/loader.service';
import { LoaderState } from '@app/shared';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Input() isLoading = false;
  @Input() message: string;

  show = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) {}
  ngOnInit() {
    this.subscription = this.loaderService.loaderState.subscribe((state: LoaderState) => {
      this.show = state.show;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
