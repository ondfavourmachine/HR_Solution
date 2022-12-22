import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobMgtComponent } from './job-mgt.component';

describe('JobMgtComponent', () => {
  let component: JobMgtComponent;
  let fixture: ComponentFixture<JobMgtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobMgtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
