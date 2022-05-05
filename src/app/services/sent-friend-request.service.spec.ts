import { TestBed } from '@angular/core/testing';

import { SentFriendRequestService } from './sent-friend-request.service';

describe('SentFriendRequestService', () => {
  let service: SentFriendRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SentFriendRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
