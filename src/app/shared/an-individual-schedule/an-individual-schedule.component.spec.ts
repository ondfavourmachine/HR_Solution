import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnIndividualScheduleComponent } from './an-individual-schedule.component';

describe('AnIndividualScheduleComponent', () => {
  let component: AnIndividualScheduleComponent;
  let fixture: ComponentFixture<AnIndividualScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnIndividualScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnIndividualScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
