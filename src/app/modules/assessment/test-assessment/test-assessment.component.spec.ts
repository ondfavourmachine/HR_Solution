import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAssessmentComponent } from './test-assessment.component';

describe('TestAssessmentComponent', () => {
  let component: TestAssessmentComponent;
  let fixture: ComponentFixture<TestAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
