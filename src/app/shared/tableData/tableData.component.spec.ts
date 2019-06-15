import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertmodalComponent } from '@app/shared/alertModal/alertmodal.component';

describe('MessageBarComponent', () => {
  let component: AlertmodalComponent;
  let fixture: ComponentFixture<AlertmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertmodalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
