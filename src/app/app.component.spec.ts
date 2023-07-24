import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ModalModule } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { ConfigService } from './core/config.service';

describe('AppComponent', () => {
	let configServiceSpy: any;

	beforeEach(waitForAsync(() => {
		configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
		configServiceSpy.getConfig.and.returnValue(of({}));

		TestBed.configureTestingModule({
			imports: [ModalModule.forRoot(), AppComponent],
			providers: [
				{ provide: ConfigService, useValue: configServiceSpy },
				provideHttpClient(),
				provideHttpClientTesting()
			]
		}).compileComponents();
	}));
	it('should create the app', waitForAsync(() => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));
	it('should include a router outlet', waitForAsync(() => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		expect(compiled.querySelector('router-outlet')).toBeTruthy();
	}));
});
