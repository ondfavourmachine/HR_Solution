import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAssessmentAuditApprovalComponent } from './test-assessment-audit-approval.component';

describe('TestAssessmentAuditApprovalComponent', () => {
  let component: TestAssessmentAuditApprovalComponent;
  let fixture: ComponentFixture<TestAssessmentAuditApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestAssessmentAuditApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAssessmentAuditApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
