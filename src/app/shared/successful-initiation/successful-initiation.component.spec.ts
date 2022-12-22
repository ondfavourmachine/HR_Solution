import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulInitiationComponent } from './successful-initiation.component';

describe('SuccessfulInitiationComponent', () => {
  let component: SuccessfulInitiationComponent;
  let fixture: ComponentFixture<SuccessfulInitiationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessfulInitiationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfulInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
