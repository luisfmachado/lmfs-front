import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticoComponent } from './automatico.component';

describe('AutomaticoComponent', () => {
  let component: AutomaticoComponent;
  let fixture: ComponentFixture<AutomaticoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutomaticoComponent]
    });
    fixture = TestBed.createComponent(AutomaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
