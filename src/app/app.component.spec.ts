import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { provideCdkDialog } from './common/dialog';
import { APP_CONFIG } from './core';
import { provideSession } from './core/provider';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AppComponent],
			providers: [
				{ provide: APP_CONFIG, useValue: signal({ roles: { user: true } }) },
				// { provide: APP_SESSION, useValue: signal(new Session({})) },
				provideSession(),
				provideCdkDialog(),
				provideHttpClient(),
				provideHttpClientTesting()
			]
		}).compileComponents();
	});
	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
	it('should include a router outlet', waitForAsync(() => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('router-outlet')).toBeTruthy();
	}));
});
