import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchScoreUploadComponent } from './batch-score-upload.component';

describe('BatchScoreUploadComponent', () => {
  let component: BatchScoreUploadComponent;
  let fixture: ComponentFixture<BatchScoreUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchScoreUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchScoreUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
