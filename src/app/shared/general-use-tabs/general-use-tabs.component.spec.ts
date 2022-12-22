import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralUseTabsComponent } from './general-use-tabs.component';

describe('GeneralUseTabsComponent', () => {
  let component: GeneralUseTabsComponent;
  let fixture: ComponentFixture<GeneralUseTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralUseTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralUseTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
