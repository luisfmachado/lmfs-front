import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoManualComponent } from './orcamento-manual.component';

describe('OrcamentoManualComponent', () => {
  let component: OrcamentoManualComponent;
  let fixture: ComponentFixture<OrcamentoManualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrcamentoManualComponent]
    });
    fixture = TestBed.createComponent(OrcamentoManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
