import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSenteceComponent } from './update-sentece.component';

describe('UpdateSenteceComponent', () => {
  let component: UpdateSenteceComponent;
  let fixture: ComponentFixture<UpdateSenteceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSenteceComponent]
    });
    fixture = TestBed.createComponent(UpdateSenteceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
