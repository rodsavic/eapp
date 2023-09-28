import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhraseCreateComponent } from './phrase-create.component';

describe('PhraseCreateComponent', () => {
  let component: PhraseCreateComponent;
  let fixture: ComponentFixture<PhraseCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhraseCreateComponent]
    });
    fixture = TestBed.createComponent(PhraseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
