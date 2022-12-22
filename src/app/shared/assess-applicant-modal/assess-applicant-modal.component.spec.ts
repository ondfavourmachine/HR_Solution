import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessApplicantModalComponent } from './assess-applicant-modal.component';

describe('AssessApplicantModalComponent', () => {
  let component: AssessApplicantModalComponent;
  let fixture: ComponentFixture<AssessApplicantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessApplicantModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessApplicantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
