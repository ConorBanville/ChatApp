import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPasswordFormComponent } from './email-password-form.component';

describe('EmailPasswordFormComponent', () => {
  let component: EmailPasswordFormComponent;
  let fixture: ComponentFixture<EmailPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPasswordFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
