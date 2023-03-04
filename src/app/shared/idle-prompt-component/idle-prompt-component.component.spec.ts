import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdlePromptComponentComponent } from './idle-prompt-component.component';

describe('IdlePromptComponentComponent', () => {
  let component: IdlePromptComponentComponent;
  let fixture: ComponentFixture<IdlePromptComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdlePromptComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdlePromptComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
