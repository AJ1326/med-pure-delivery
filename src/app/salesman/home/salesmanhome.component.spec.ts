import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { SalesmanhomeComponent } from './salesmanhome.component';
import { QuoteService } from './quote.service';

describe('HomeComponent', () => {
  let component: SalesmanhomeComponent;
  let fixture: ComponentFixture<SalesmanhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule, HttpClientTestingModule],
      declarations: [SalesmanhomeComponent],
      providers: [QuoteService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
