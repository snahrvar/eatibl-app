import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayDiscountComponent } from './day-discount.component';

describe('DayDiscountComponent', () => {
  let component: DayDiscountComponent;
  let fixture: ComponentFixture<DayDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
