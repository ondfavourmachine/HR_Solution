import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCandidateJobsComponent } from './external-candidate-jobs.component';

describe('ExternalCandidateJobsComponent', () => {
  let component: ExternalCandidateJobsComponent;
  let fixture: ComponentFixture<ExternalCandidateJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalCandidateJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalCandidateJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
