import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmucVatTuComponent } from './dmuc-vat-tu.component';

describe('DmucVatTuComponent', () => {
  let component: DmucVatTuComponent;
  let fixture: ComponentFixture<DmucVatTuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmucVatTuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmucVatTuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
