import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesmanComponent } from './add-salesman.component';

describe('PlacingOrderComponent', () => {
  let component: AddSalesmanComponent;
  let fixture: ComponentFixture<AddSalesmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesmanComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
