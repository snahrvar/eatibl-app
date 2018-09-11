import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsUserLogService } from './analytics-user-log.service';

describe('AnalyticsUserLogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsUserLogService]
    });
  });

  it('should be created', inject([AnalyticsUserLogService], (service: AnalyticsUserLogService) => {
    expect(service).toBeTruthy();
  }));
});
