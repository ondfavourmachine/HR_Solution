import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantImageCvDetailsComponent } from './applicant-image-cv-details.component';

describe('ApplicantImageCvDetailsComponent', () => {
  let component: ApplicantImageCvDetailsComponent;
  let fixture: ComponentFixture<ApplicantImageCvDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantImageCvDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantImageCvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
