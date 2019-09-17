import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { SalesmanaddRetailerComponent } from './salesmanaddRetailer.component';
import { QuoteService } from './quote.service';

describe('HomeComponent', () => {
  let component: SalesmanaddRetailerComponent;
  let fixture: ComponentFixture<SalesmanaddRetailerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule, SharedModule, HttpClientTestingModule],
      declarations: [SalesmanaddRetailerComponent],
      providers: [QuoteService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanaddRetailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
