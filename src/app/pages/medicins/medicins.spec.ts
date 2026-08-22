import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Medicins } from './medicins';

describe('Medicins', () => {
  let component: Medicins;
  let fixture: ComponentFixture<Medicins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Medicins],
    }).compileComponents();

    fixture = TestBed.createComponent(Medicins);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
