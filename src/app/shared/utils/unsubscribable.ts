import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export abstract class Unsubscribable implements OnDestroy {
  protected unsubscribe$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
