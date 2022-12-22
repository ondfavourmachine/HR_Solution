import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentSheetComponent } from './assessment-sheet.component';

describe('AssessmentSheetComponent', () => {
  let component: AssessmentSheetComponent;
  let fixture: ComponentFixture<AssessmentSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
