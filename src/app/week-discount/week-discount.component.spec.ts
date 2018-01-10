import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekDiscountComponent } from './week-discount.component';

describe('WeekDiscountComponent', () => {
  let component: WeekDiscountComponent;
  let fixture: ComponentFixture<WeekDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
