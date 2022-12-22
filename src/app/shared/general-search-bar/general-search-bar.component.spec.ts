import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSearchBarComponent } from './general-search-bar.component';

describe('GeneralSearchBarComponent', () => {
  let component: GeneralSearchBarComponent;
  let fixture: ComponentFixture<GeneralSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
