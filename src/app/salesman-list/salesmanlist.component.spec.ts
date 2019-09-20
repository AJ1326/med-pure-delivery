import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanlistComponent } from './salesmanlist.component';

describe('AboutComponent', () => {
  let component: SalesmanlistComponent;
  let fixture: ComponentFixture<SalesmanlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanlistComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
