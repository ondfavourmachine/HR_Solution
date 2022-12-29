import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAcceptanceInformationComponent } from './post-acceptance-information.component';

describe('PostAcceptanceInformationComponent', () => {
  let component: PostAcceptanceInformationComponent;
  let fixture: ComponentFixture<PostAcceptanceInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostAcceptanceInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAcceptanceInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
