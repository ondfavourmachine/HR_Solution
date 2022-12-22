import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewAssessmentComponent } from './interview-assessment.component';

describe('InterviewAssessmentComponent', () => {
  let component: InterviewAssessmentComponent;
  let fixture: ComponentFixture<InterviewAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
