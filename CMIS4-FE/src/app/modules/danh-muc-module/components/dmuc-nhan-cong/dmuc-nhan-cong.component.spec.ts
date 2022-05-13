import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmucNhanCongComponent } from './dmuc-nhan-cong.component';

describe('DmucNhanCongComponent', () => {
  let component: DmucNhanCongComponent;
  let fixture: ComponentFixture<DmucNhanCongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmucNhanCongComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmucNhanCongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
