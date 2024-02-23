import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { ConfigService } from '../../../config.service';
import { ManageUserComponent } from './manage-user.component';

describe('ManageUserComponent', () => {
	let component: ManageUserComponent;
	let fixture: ComponentFixture<ManageUserComponent>;

	let configServiceSpy: any;

	beforeEach(() => {
		configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
		configServiceSpy.getConfig.and.returnValue(of({}));

		TestBed.configureTestingModule({
			imports: [ManageUserComponent, HttpClientTestingModule],
			providers: [
				{ provide: ConfigService, useValue: configServiceSpy },
				{
					provide: ActivatedRoute,
					useValue: {}
				}
			]
		});
		fixture = TestBed.createComponent(ManageUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
