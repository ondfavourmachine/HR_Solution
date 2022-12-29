import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInviteDescriptionViewComponent } from './test-invite-description-view.component';

describe('TestInviteDescriptionViewComponent', () => {
  let component: TestInviteDescriptionViewComponent;
  let fixture: ComponentFixture<TestInviteDescriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestInviteDescriptionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestInviteDescriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
