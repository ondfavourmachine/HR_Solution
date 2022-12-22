import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMgtComponent } from './role-mgt.component';

describe('RoleMgtComponent', () => {
  let component: RoleMgtComponent;
  let fixture: ComponentFixture<RoleMgtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleMgtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleMgtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
