import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCreateComponent } from './word-create.component';

describe('WordCreateComponent', () => {
  let component: WordCreateComponent;
  let fixture: ComponentFixture<WordCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordCreateComponent]
    });
    fixture = TestBed.createComponent(WordCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
