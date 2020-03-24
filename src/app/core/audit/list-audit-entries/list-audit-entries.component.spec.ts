import { FormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { of } from 'rxjs/index';

import { NgSelectModule } from '@ng-select/ng-select';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { DirectivesModule } from '../../../common/directives.module';
import { PagingModule, PagingResults } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';
import { SystemAlertModule, SystemAlertService } from '../../../common/system-alert.module';

import { ListAuditEntriesComponent } from './list-audit-entries.component';
import {
	AuditObjectComponent,
	UrlAuditObjectComponent,
	DefaultAuditObjectComponent,
	ExportAuditObjectComponent,
	UserAuditObjectComponent,
	UserAuthenticationObjectComponent
} from '../audit-object.component';
import { AuditService } from '../audit.service';

describe('Audit Component Spec', () => {
	let auditServiceSpy;

	let fixture: ComponentFixture<ListAuditEntriesComponent>;
	let component: ListAuditEntriesComponent;
	let rootHTMLElement: HTMLElement;

	const matchedUsers = {
		elements: [
			{
				userModel: {
					name: 'Test User 01',
					username: 'test01'
				}
			},
			{
				userModel: {
					name: 'Test User 02',
					username: 'test02'
				}
			}
		],
		totalPages: 1,
		totalSize: 2
	} as PagingResults;

	const distinctResultsActions = ['admin update', 'create', 'authentication succeeded'];
	const distinctResultsTypes = ['user', 'user-authentication'];
	const searchResults = {
		elements: [
			{
				created: 1567973747442,
				id: '5d75617309e3e93d36b1c948',
				message: 'admin user updated',
				audit: {
					action: 'admin update',
					actor: {
						username: 'testuser01',
						name: 'Test User 01'
					},
					auditType: 'user',
					object: {
						before: {
							username: 'testuser01',
							name: 'Test User 1'
						},
						after: {
							username: 'testuser01',
							name: 'Test User 01'
						}
					}
				}
			}
		]
	};

	beforeEach(async () => {
		auditServiceSpy = jasmine.createSpyObj('AuditService', [
			'getDistinctAuditValues',
			'search',
			'matchUser'
		]);
		auditServiceSpy.getDistinctAuditValues.and.callFake(field => {
			if (field === 'audit.action') {
				return of(distinctResultsActions);
			} else if (field === 'audit.auditType') {
				return of(distinctResultsTypes);
			} else {
				throw new Error('should not get here');
			}
		});
		auditServiceSpy.search.and.returnValue(of(searchResults));
		auditServiceSpy.matchUser.and.returnValue(of(matchedUsers));

		TestBed.configureTestingModule({
			declarations: [
				ListAuditEntriesComponent,
				AuditObjectComponent,
				UrlAuditObjectComponent,
				DefaultAuditObjectComponent,
				ExportAuditObjectComponent,
				UserAuditObjectComponent,
				UserAuthenticationObjectComponent
			],
			imports: [
				BsDatepickerModule.forRoot(),
				ModalModule.forRoot(),
				TypeaheadModule.forRoot(),
				TooltipModule.forRoot(),
				NgSelectModule,
				DirectivesModule,
				FormsModule,
				PagingModule,
				PipesModule,
				SystemAlertModule
			],
			providers: [
				{ provide: AuditService, useValue: auditServiceSpy },
				BsModalService,
				SystemAlertService
			]
		}).overrideModule(BrowserDynamicTestingModule, {
			set: {}
		});

		fixture = TestBed.createComponent(ListAuditEntriesComponent);
		component = fixture.componentInstance;

		rootHTMLElement = fixture.debugElement.nativeElement;
	});

	describe('audit list display', () => {
		it('should display the audit entry on load', () => {
			fixture.detectChanges();

			console.log(component.loading);

			fixture.whenStable().then(() => {
				// Verify that the Address String is display in the proper HTML field
				expect(rootHTMLElement.querySelector('.table-row').textContent).toContain(
					'testuser01'
				);
				expect(rootHTMLElement.querySelector('.table-row').textContent).toContain(
					'admin update'
				);
				expect(rootHTMLElement.querySelector('.table-row').textContent).toContain(
					'2019-09-08 20:15:47Z'
				);

				// Verify that the values are formatted properly

				// Verify that we're not spamming the service
				expect(auditServiceSpy.getDistinctAuditValues).toHaveBeenCalledTimes(2);
				expect(auditServiceSpy.search).toHaveBeenCalledTimes(1);
			});
		});
	});
});
