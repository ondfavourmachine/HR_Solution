import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAScheduleComponent } from './create-aschedule.component';

describe('CreateAScheduleComponent', () => {
  let component: CreateAScheduleComponent;
  let fixture: ComponentFixture<CreateAScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
