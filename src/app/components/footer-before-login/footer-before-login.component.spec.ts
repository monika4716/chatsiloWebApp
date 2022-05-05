import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBeforeLoginComponent } from './footer-before-login.component';

describe('FooterBeforeLoginComponent', () => {
  let component: FooterBeforeLoginComponent;
  let fixture: ComponentFixture<FooterBeforeLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterBeforeLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterBeforeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
