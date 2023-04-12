import { TestBed, waitForAsync } from '@angular/core/testing';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { of } from 'rxjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService, CoreModule } from './core/core.module';
import { SiteModule } from './site/site.module';

describe('AppComponent', () => {
	let configServiceSpy: any;

	beforeEach(waitForAsync(() => {
		configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
		configServiceSpy.getConfig.and.returnValue(of({}));

		TestBed.configureTestingModule({
			declarations: [AppComponent],
			imports: [AppRoutingModule, CoreModule, SiteModule, PopoverModule.forRoot()],
			providers: [{ provide: ConfigService, useValue: configServiceSpy }]
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
