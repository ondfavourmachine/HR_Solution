import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewApprovalComponent } from './interview-approval.component';

describe('InterviewApprovalComponent', () => {
  let component: InterviewApprovalComponent;
  let fixture: ComponentFixture<InterviewApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
