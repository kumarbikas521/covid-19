import { TestBed } from '@angular/core/testing';

import { IndiaApiServiceService } from './india-api-service.service';

describe('IndiaApiServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndiaApiServiceService = TestBed.get(IndiaApiServiceService);
    expect(service).toBeTruthy();
  });
});
