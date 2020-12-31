import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PassengerListPage } from './passenger-list.page';

describe('PassengerListPage', () => {
  let component: PassengerListPage;
  let fixture: ComponentFixture<PassengerListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassengerListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PassengerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
