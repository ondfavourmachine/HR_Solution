import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewAssessmentDetailsComponent } from './interview-assessment-details.component';

describe('InterviewAssessmentDetailsComponent', () => {
  let component: InterviewAssessmentDetailsComponent;
  let fixture: ComponentFixture<InterviewAssessmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewAssessmentDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewAssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
