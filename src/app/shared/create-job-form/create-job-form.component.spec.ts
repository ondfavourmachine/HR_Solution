import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobFormComponent } from './create-job-form.component';

describe('CreateJobFormComponent', () => {
  let component: CreateJobFormComponent;
  let fixture: ComponentFixture<CreateJobFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJobFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateJobFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
