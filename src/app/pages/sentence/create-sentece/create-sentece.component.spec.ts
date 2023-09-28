import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSenteceComponent } from './create-sentece.component';

describe('CreateSenteceComponent', () => {
  let component: CreateSenteceComponent;
  let fixture: ComponentFixture<CreateSenteceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSenteceComponent]
    });
    fixture = TestBed.createComponent(CreateSenteceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
