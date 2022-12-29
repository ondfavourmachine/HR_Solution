import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAcceptanceSelectionComponent } from './post-acceptance-selection.component';

describe('PostAcceptanceSelectionComponent', () => {
  let component: PostAcceptanceSelectionComponent;
  let fixture: ComponentFixture<PostAcceptanceSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostAcceptanceSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAcceptanceSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
