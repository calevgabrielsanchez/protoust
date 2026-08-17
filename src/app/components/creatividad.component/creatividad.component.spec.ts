import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatividadComponent } from './creatividad.component';

describe('CreatividadComponent', () => {
  let component: CreatividadComponent;
  let fixture: ComponentFixture<CreatividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatividadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatividadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
