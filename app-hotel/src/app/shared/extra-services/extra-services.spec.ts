import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraServices } from './extra-services';

describe('ExtraServices', () => {
  let component: ExtraServices;
  let fixture: ComponentFixture<ExtraServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
