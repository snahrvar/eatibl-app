import { TestBed, inject } from '@angular/core/testing';

import { AnalyticsRestaurantService } from './analytics-restaurant.service';

describe('AnalyticsRestaurantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyticsRestaurantService]
    });
  });

  it('should be created', inject([AnalyticsRestaurantService], (service: AnalyticsRestaurantService) => {
    expect(service).toBeTruthy();
  }));
});
