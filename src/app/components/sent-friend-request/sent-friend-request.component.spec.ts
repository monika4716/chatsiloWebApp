import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentFriendRequestComponent } from './sent-friend-request.component';

describe('SentFriendRequestComponent', () => {
  let component: SentFriendRequestComponent;
  let fixture: ComponentFixture<SentFriendRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentFriendRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentFriendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
