import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSelectionComponent } from './home-selection.component';

describe('HomeSelectionComponent', () => {
  let component: HomeSelectionComponent;
  let fixture: ComponentFixture<HomeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
