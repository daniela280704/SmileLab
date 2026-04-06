import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCrearProducto } from './admin-crear-producto';

describe('AdminCrearProducto', () => {
  let component: AdminCrearProducto;
  let fixture: ComponentFixture<AdminCrearProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCrearProducto],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCrearProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
