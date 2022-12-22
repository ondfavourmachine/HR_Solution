import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewSelectionComponent } from './interview-selection.component';

describe('InterviewSelectionComponent', () => {
  let component: InterviewSelectionComponent;
  let fixture: ComponentFixture<InterviewSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
