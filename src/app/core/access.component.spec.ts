import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Navigation, Router } from '@angular/router';

import { AccessComponent } from './access.component';

describe('AccessComponent', () => {
	let mockNavigation: Navigation;

	beforeEach(async () => {
		mockNavigation = {
			extras: {}
		} as Navigation;

		await TestBed.configureTestingModule({
			declarations: [AccessComponent],
			imports: [BrowserModule],
			providers: [
				{
					provide: Router,
					useValue: {
						getCurrentNavigation: (): Navigation => {
							return mockNavigation;
						}
					}
				}
			]
		}).compileComponents();
	});

	it('should render default values without extra state', async () => {
		const fixture = TestBed.createComponent(AccessComponent);
		const instance = fixture.componentInstance;
		const rootHTMLElement = fixture.debugElement.nativeElement;
		fixture.autoDetectChanges();
		await fixture.whenStable();
		expect(instance.status).toBe('403');
		expect(rootHTMLElement.querySelector('h1').textContent).toBe('403');
		expect(instance.message).toBe('User is missing authorizations for access.');
		expect(rootHTMLElement.querySelector('p').textContent).toBe(
			'User is missing authorizations for access.'
		);
	});

	it('should render provided values from extras state', async () => {
		mockNavigation.extras = {
			state: {
				status: 'Unauthorized',
				message: 'Another message.'
			}
		};
		const fixture = TestBed.createComponent(AccessComponent);
		const instance = fixture.componentInstance;
		const rootHTMLElement = fixture.debugElement.nativeElement;
		fixture.autoDetectChanges();
		await fixture.whenStable();
		expect(instance.status).toBe('Unauthorized');
		expect(rootHTMLElement.querySelector('h1').textContent).toBe('Unauthorized');
		expect(instance.message).toBe('Another message.');
		expect(rootHTMLElement.querySelector('p').textContent).toBe('Another message.');
	});
});
