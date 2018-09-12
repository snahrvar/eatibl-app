import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsBookingService } from './analytics-booking.service';

describe('AnalyticsBookingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsBookingService]
    });
  });

  it('should be created', inject([AnalyticsBookingService], (service: AnalyticsBookingService) => {
    expect(service).toBeTruthy();
  }));
});
