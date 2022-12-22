import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSelectionComponent } from './test-selection.component';

describe('TestSelectionComponent', () => {
  let component: TestSelectionComponent;
  let fixture: ComponentFixture<TestSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
