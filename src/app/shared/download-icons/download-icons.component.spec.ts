import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadIconsComponent } from './download-icons.component';

describe('DownloadIconsComponent', () => {
  let component: DownloadIconsComponent;
  let fixture: ComponentFixture<DownloadIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadIconsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
