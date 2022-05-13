import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmucVanChuyenComponent } from './dmuc-van-chuyen.component';

describe('DmucVanChuyenComponent', () => {
  let component: DmucVanChuyenComponent;
  let fixture: ComponentFixture<DmucVanChuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmucVanChuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmucVanChuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
