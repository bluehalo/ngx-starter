import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { APP_CONFIG } from '../../../tokens';
import { ManageUserComponent } from './manage-user.component';

describe('ManageUserComponent', () => {
	let component: ManageUserComponent;
	let fixture: ComponentFixture<ManageUserComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ManageUserComponent],
			providers: [
				{ provide: APP_CONFIG, useValue: signal({}) },
				{
					provide: ActivatedRoute,
					useValue: {}
				},
				provideHttpClient(withInterceptorsFromDi()),
				provideHttpClientTesting()
			]
		});
		fixture = TestBed.createComponent(ManageUserComponent);
		fixture.componentRef.setInput('user', undefined);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
