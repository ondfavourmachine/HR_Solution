import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSearchParamsWithDownloadIconsComponent } from './table-search-params-with-download-icons.component';

describe('TableSearchParamsWithDownloadIconsComponent', () => {
  let component: TableSearchParamsWithDownloadIconsComponent;
  let fixture: ComponentFixture<TableSearchParamsWithDownloadIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSearchParamsWithDownloadIconsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSearchParamsWithDownloadIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
