import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCitoyen } from './dashboard-citoyen';

describe('DashboardCitoyen', () => {
  let component: DashboardCitoyen;
  let fixture: ComponentFixture<DashboardCitoyen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCitoyen],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCitoyen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
