import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantNavComponent } from './restaurant-nav.component';

describe('RestaurantNavComponent', () => {
  let component: RestaurantNavComponent;
  let fixture: ComponentFixture<RestaurantNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
