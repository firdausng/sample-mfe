import { TestBed } from '@angular/core/testing';

import { ConfigLibService } from './config-lib.service';

describe('ConfigLibService', () => {
  let service: ConfigLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
