import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeaningComponent } from './meaning.component';

describe('MeaningComponent', () => {
  let component: MeaningComponent;
  let fixture: ComponentFixture<MeaningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeaningComponent]
    });
    fixture = TestBed.createComponent(MeaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
