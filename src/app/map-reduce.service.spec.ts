import { TestBed } from '@angular/core/testing';

import { MapReduceService } from './map-reduce.service';

describe('MapReduceService', () => {
  let service: MapReduceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapReduceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
