import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalModalComponent } from './approval-modal.component';

describe('ApprovalModalComponent', () => {
  let component: ApprovalModalComponent;
  let fixture: ComponentFixture<ApprovalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
