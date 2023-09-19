import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordUpdateComponent } from './word-update.component';

describe('WordUpdateComponent', () => {
  let component: WordUpdateComponent;
  let fixture: ComponentFixture<WordUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordUpdateComponent]
    });
    fixture = TestBed.createComponent(WordUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
