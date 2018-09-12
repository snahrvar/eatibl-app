import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsDeviceService } from './analytics-device.service';

describe('AnalyticsDeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsDeviceService]
    });
  });

  it('should be created', inject([AnalyticsDeviceService], (service: AnalyticsDeviceService) => {
    expect(service).toBeTruthy();
  }));
});
