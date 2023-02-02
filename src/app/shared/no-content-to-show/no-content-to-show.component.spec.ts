import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoContentToShowComponent } from './no-content-to-show.component';

describe('NoContentToShowComponent', () => {
  let component: NoContentToShowComponent;
  let fixture: ComponentFixture<NoContentToShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoContentToShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoContentToShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
