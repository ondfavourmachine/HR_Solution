import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCandidateDashboardComponent } from './external-candidate-dashboard.component';

describe('ExternalCandidateDashboardComponent', () => {
  let component: ExternalCandidateDashboardComponent;
  let fixture: ComponentFixture<ExternalCandidateDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalCandidateDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalCandidateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
