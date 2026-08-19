import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeIntervention } from './liste-intervention';

describe('ListeIntervention', () => {
  let component: ListeIntervention;
  let fixture: ComponentFixture<ListeIntervention>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeIntervention],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeIntervention);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
