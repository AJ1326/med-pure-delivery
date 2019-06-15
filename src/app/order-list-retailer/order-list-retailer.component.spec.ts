import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListRetailerComponent } from './order-list-retailer.component';

describe('PlacingOrderComponent', () => {
  let component: OrderListRetailerComponent;
  let fixture: ComponentFixture<OrderListRetailerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderListRetailerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListRetailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
