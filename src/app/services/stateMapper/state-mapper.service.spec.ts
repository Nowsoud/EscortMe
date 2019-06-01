import { TestBed } from '@angular/core/testing';

import { StateMapperService } from './state-mapper.service';

describe('StateMapperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateMapperService = TestBed.get(StateMapperService);
    expect(service).toBeTruthy();
  });
});
