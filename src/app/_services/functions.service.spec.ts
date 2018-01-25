import { TestBed, inject } from '@angular/core/testing';

import { FunctionsService } from './functions.service.ts';

describe('FunctionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FunctionsService]
    });
  });

  it('should be created', inject([FunctionsService], (service: FunctionsService) => {
    expect(service).toBeTruthy();
  }));
});
