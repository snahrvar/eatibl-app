import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyHoursComponent } from './key-hours.component';

describe('KeyHoursComponent', () => {
  let component: KeyHoursComponent;
  let fixture: ComponentFixture<KeyHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
