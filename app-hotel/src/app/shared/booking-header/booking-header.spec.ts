import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingHeader } from './booking-header';

describe('BookingHeader', () => {
  let component: BookingHeader;
  let fixture: ComponentFixture<BookingHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
