import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewSummaryComponent } from './interview-summary.component';

describe('InterviewSummaryComponent', () => {
  let component: InterviewSummaryComponent;
  let fixture: ComponentFixture<InterviewSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
