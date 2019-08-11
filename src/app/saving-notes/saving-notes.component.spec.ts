import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingNotesComponent } from './saving-notes.component';

describe('PlacingOrderComponent', () => {
  let component: SavingNotesComponent;
  let fixture: ComponentFixture<SavingNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SavingNotesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
