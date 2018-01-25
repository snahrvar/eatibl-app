import { TestBed, inject } from '@angular/core/testing';

import { DialogsService } from './dialog.service.ts';

describe('DialogsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogsService]
    });
  });

  it('should be created', inject([DialogsService], (service: DialogsService) => {
    expect(service).toBeTruthy();
  }));
});
