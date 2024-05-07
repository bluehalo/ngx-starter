import { DialogModule } from '@angular/cdk/dialog';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { Session } from '../auth';
import { Config } from '../config.model';
import { MasqueradeService } from '../masquerade/masquerade.service';
import { MessageService } from '../messages/message.service';
import { APP_CONFIG, APP_SESSION } from '../tokens';
import { SiteNavbarComponent } from './site-navbar.component';

describe('Site Navbar Component Spec', () => {
	let authorizationServiceSpy: any;
	let messageServiceSpy: any;
	let masqServiceSpy: any;

	const defaultMockConfig: Partial<Config> = {
		auth: 'local',
		app: { title: 'Test', clientUrl: '/' },
		apiDocs: {
			enabled: true,
			path: '/api-docs'
		},
		banner: { html: 'Testing', style: '' },
		copyright: {
			html: 'Testing',
			style: ''
		},
		contactEmail: 'test@test.com',
		teams: { implicitMembers: { strategy: 'local' } },
		version: 'test',
		masqueradeEnabled: false,
		allowDeleteUser: true
	};

	let mockConfig: Partial<Config>;

	beforeEach(async () => {
		// reset for each test
		mockConfig = {
			...defaultMockConfig
		};

		authorizationServiceSpy = jasmine.createSpyObj('AuthorizationService', [
			'isAuthenticated',
			'hasRole',
			'hasSomeRoles',
			'hasEveryRole'
		]);
		authorizationServiceSpy.isAuthenticated.and.returnValue(of(true));
		authorizationServiceSpy.hasRole.and.returnValue(of(true));
		authorizationServiceSpy.hasSomeRoles.and.returnValue(of(true));
		authorizationServiceSpy.hasEveryRole.and.returnValue(of(true));

		messageServiceSpy = jasmine.createSpyObj('MessageService', ['remove']);
		messageServiceSpy.remove.and.returnValue(of({}));
		messageServiceSpy.numMessagesIndicator$ = of(0);

		masqServiceSpy = jasmine.createSpyObj('MasqueradeService', ['getMasqueradeDn']);
		masqServiceSpy.getMasqueradeDn.and.returnValue(undefined);

		TestBed.configureTestingModule({
			declarations: [],
			imports: [HttpClientTestingModule, RouterModule.forRoot([]), DialogModule],
			providers: [
				{ provide: APP_CONFIG, useValue: signal(mockConfig) },
				{ provide: APP_SESSION, useValue: signal(new Session()) },
				{ provide: MessageService, useValue: messageServiceSpy },
				{ provide: MasqueradeService, useValue: masqServiceSpy }
			]
		});
	});

	describe('api docs display', () => {
		it('should not display the api docs when missing', async () => {
			mockConfig.apiDocs = null;

			const fixture = TestBed.createComponent(SiteNavbarComponent);
			const component = fixture.componentInstance;

			expect(component.helpNavOpen()).toEqual(false);

			fixture.detectChanges();
			await fixture.whenStable();

			expect(component.helpNavOpen()).toEqual(false);

			const bottomMenuItems = fixture.debugElement.queryAll(
				By.css('li.nav-popover-bottom > a')
			);
			const helpMenuItem = bottomMenuItems[bottomMenuItems.length - 1];
			helpMenuItem.triggerEventHandler('click', null);

			fixture.detectChanges();
			await fixture.whenStable();

			expect(component.helpNavOpen()).toEqual(true);
			expect(component.showApiDocsLink()).toEqual(false);
			expect(component.apiDocsLink()).toEqual('');

			/*
			 * TODO Unclear how to test that the popover contents do NOT
			 * include the contents of API Docs link
			 */
		});

		it('should not display the api docs when disabled', async () => {
			mockConfig.apiDocs = {
				enabled: false,
				path: '/some-path'
			};

			const fixture = TestBed.createComponent(SiteNavbarComponent);
			const component = fixture.componentInstance;

			expect(component.helpNavOpen()).toEqual(false);

			fixture.detectChanges();
			await fixture.whenStable();

			expect(component.helpNavOpen()).toEqual(false);
			expect(component.showApiDocsLink()).toEqual(false);
			expect(component.apiDocsLink()).toEqual('/some-path');

			const bottomMenuItems = fixture.debugElement.queryAll(
				By.css('li.nav-popover-bottom > a')
			);
			const helpMenuItem = bottomMenuItems[bottomMenuItems.length - 1];
			helpMenuItem.triggerEventHandler('click', null);

			fixture.detectChanges();
			await fixture.whenStable();

			expect(component.helpNavOpen()).toEqual(true);
			expect(component.showApiDocsLink()).toEqual(false);
			expect(component.apiDocsLink()).toEqual('/some-path');

			/*
			 * TODO Unclear how to test that the popover contents do NOT
			 * include the contents of API Docs link
			 */
		});

		it('should display the api docs when enabled', async () => {
			mockConfig.apiDocs = {
				enabled: true,
				path: '/some-path'
			};

			const fixture = TestBed.createComponent(SiteNavbarComponent);
			const component = fixture.componentInstance;

			fixture.detectChanges();
			await fixture.whenStable();

			const bottomMenuItems = fixture.debugElement.queryAll(By.directive(CdkMenuTrigger));
			const helpMenuItem = bottomMenuItems[bottomMenuItems.length - 1];
			helpMenuItem.triggerEventHandler('click', null);

			fixture.detectChanges();
			await fixture.whenStable();

			expect(component.helpNavOpen()).toEqual(true);
			expect(component.showApiDocsLink()).toEqual(true);
			expect(component.apiDocsLink()).toEqual('/some-path');

			/*
			 * TODO Unclear how to test that the popover contents DO
			 * include the contents of API Docs link
			 */
		});
	});
});
