import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewJobDetailsComponent } from './preview-job-details.component';

describe('PreviewJobDetailsComponent', () => {
  let component: PreviewJobDetailsComponent;
  let fixture: ComponentFixture<PreviewJobDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewJobDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
