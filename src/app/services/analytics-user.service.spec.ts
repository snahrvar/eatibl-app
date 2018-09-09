import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsUserService } from './analytics-user.service';

describe('AnalyticsUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsUserService]
    });
  });

  it('should be created', inject([AnalyticsUserService], (service: AnalyticsUserService) => {
    expect(service).toBeTruthy();
  }));
});
