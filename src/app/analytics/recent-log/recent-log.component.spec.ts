import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentLogComponent } from './recent-log.component';

describe('RecentLogComponent', () => {
  let component: RecentLogComponent;
  let fixture: ComponentFixture<RecentLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
