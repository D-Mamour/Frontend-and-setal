import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAgentProfil } from './admin-agent-profil';

describe('AdminAgentProfil', () => {
  let component: AdminAgentProfil;
  let fixture: ComponentFixture<AdminAgentProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAgentProfil],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAgentProfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
