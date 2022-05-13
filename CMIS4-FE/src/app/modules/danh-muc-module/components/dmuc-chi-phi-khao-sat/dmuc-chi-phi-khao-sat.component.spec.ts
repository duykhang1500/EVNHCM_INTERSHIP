import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmucChiPhiKhaoSatComponent } from './dmuc-chi-phi-khao-sat.component';

describe('DmucChiPhiKhaoSatComponent', () => {
  let component: DmucChiPhiKhaoSatComponent;
  let fixture: ComponentFixture<DmucChiPhiKhaoSatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmucChiPhiKhaoSatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmucChiPhiKhaoSatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
