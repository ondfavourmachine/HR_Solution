import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyForJobByInternalStaffComponent } from './apply-for-job-by-internal-staff.component';

describe('ApplyForJobByInternalStaffComponent', () => {
  let component: ApplyForJobByInternalStaffComponent;
  let fixture: ComponentFixture<ApplyForJobByInternalStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyForJobByInternalStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyForJobByInternalStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
