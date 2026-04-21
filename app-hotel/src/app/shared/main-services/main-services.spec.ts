import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainServices } from './main-services';

describe('MainServices', () => {
  let component: MainServices;
  let fixture: ComponentFixture<MainServices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainServices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainServices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
