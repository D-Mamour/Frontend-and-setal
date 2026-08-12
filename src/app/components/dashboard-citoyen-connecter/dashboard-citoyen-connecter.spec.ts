import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCitoyenConnecter } from './dashboard-citoyen-connecter';

describe('DashboardCitoyenConnecter', () => {
  let component: DashboardCitoyenConnecter;
  let fixture: ComponentFixture<DashboardCitoyenConnecter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCitoyenConnecter],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCitoyenConnecter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
