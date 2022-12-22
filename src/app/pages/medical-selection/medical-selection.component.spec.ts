import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSelectionComponent } from './medical-selection.component';

describe('MedicalSelectionComponent', () => {
  let component: MedicalSelectionComponent;
  let fixture: ComponentFixture<MedicalSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
