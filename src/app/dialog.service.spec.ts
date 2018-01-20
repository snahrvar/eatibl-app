import { TestBed, inject } from '@angular/core/testing';

import { DialogsServiceService } from './dialog.service';

describe('DialogsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogsServiceService]
    });
  });

  it('should be created', inject([DialogsServiceService], (service: DialogsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
