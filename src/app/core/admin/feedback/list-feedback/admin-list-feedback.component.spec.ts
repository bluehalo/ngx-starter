import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { of } from 'rxjs';

import { PagingResults } from '../../../../common/paging/paging.model';
import { PipesModule } from '../../../../common/pipes.module';
import { SearchInputModule } from '../../../../common/search-input.module';
import { SystemAlertModule } from '../../../../common/system-alert.module';
import { TableModule } from '../../../../common/table.module';
import { User } from '../../../auth/user.model';
import { ConfigService } from '../../../config.service';
import { ExportConfigService } from '../../../export-config.service';
import { FeedbackService } from '../../../feedback/feedback.service';
import { AdminUsersService } from '../../user-management/admin-users.service';
import { AdminListFeedbackComponent } from './admin-list-feedback.component';

describe('Admin List Feedback Component Spec', () => {
	let feedbackServiceSpy: any;
	let configServiceSpy: any;
	let exportConfigServiceSpy: any;
	let exportResponseId: string;
	let adminUsersServiceSpy: any;

	const mockFeedback: PagingResults<User> = {
		elements: [],
		totalPages: 1,
		totalSize: 0,
		pageNumber: 0,
		pageSize: 20
	};

	let fixture: ComponentFixture<AdminListFeedbackComponent>;
	let component: AdminListFeedbackComponent;
	let rootHTMLElement: HTMLElement;

	const clickExportButton = async () => {
		const exportButtonElement =
			rootHTMLElement.querySelector('span.fa-download')?.parentElement;
		expect(exportButtonElement?.textContent?.trim()).toEqual('Export');
		exportButtonElement?.click();
		fixture.detectChanges();
		await fixture.whenStable();
	};

	beforeEach(async () => {
		exportResponseId = `${Math.random()}`;

		// reset for each test
		feedbackServiceSpy = jasmine.createSpyObj('FeedbackService', ['getFeedback']);
		feedbackServiceSpy.getFeedback.and.returnValue(of(mockFeedback));

		configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
		configServiceSpy.getConfig.and.returnValue(of({}));

		exportConfigServiceSpy = jasmine.createSpyObj('ExportConfigService', ['postExportConfig']);
		exportConfigServiceSpy.postExportConfig.and.returnValue(
			of({
				_id: exportResponseId
			})
		);

		adminUsersServiceSpy = jasmine.createSpyObj('AdminUsersService', ['getAll']);
		adminUsersServiceSpy.getAll.and.returnValue(of(['mockUser']));

		TestBed.configureTestingModule({
			declarations: [AdminListFeedbackComponent],
			imports: [
				FormsModule,
				RouterTestingModule,
				PipesModule,
				SearchInputModule,
				SystemAlertModule,
				NgSelectModule,
				TooltipModule.forRoot(),
				CdkTableModule,
				TableModule,
				BrowserAnimationsModule
			],
			providers: [
				{ provide: FeedbackService, useValue: feedbackServiceSpy },
				{ provide: ConfigService, useValue: configServiceSpy },
				{ provide: ExportConfigService, useValue: exportConfigServiceSpy },
				{ provide: AdminUsersService, useValue: adminUsersServiceSpy }
			]
		});

		fixture = TestBed.createComponent(AdminListFeedbackComponent);
		component = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
	});

	it('should initialize the feedback listing', async () => {
		expect(feedbackServiceSpy.getFeedback).toHaveBeenCalledTimes(0);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		await fixture.whenStable();
		expect(feedbackServiceSpy.getFeedback).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);
	});

	it('should enable the email column and export the current view', async () => {
		expect(feedbackServiceSpy.getFeedback).toHaveBeenCalledTimes(0);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(feedbackServiceSpy.getFeedback).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);

		// Toggle the email filter on
		component.displayedColumns.push('creator.email');

		expect(component.displayedColumns.includes('creator.email')).toEqual(true);

		// Click the export button
		await clickExportButton();

		const expectedColumnNames = [
			'creator.name',
			'creator.email',
			'created',
			'body',
			'status',
			'assignee'
		];
		const expectedColumns = component.columns
			.filter((column) => expectedColumnNames.includes(column.key))
			.map((column) => {
				return { key: column.key, title: column.label };
			});

		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledWith('feedback', {
			q: {},
			s: '',
			sort: 'created',
			dir: 'DESC',
			cols: expectedColumns
		});
	});

	it('should disable the Submitted By column and export the current view', async () => {
		expect(feedbackServiceSpy.getFeedback).toHaveBeenCalledTimes(0);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(feedbackServiceSpy.getFeedback).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);

		// Toggle the Submitted By filter off
		component.displayedColumns.splice(component.displayedColumns.indexOf('creator.name'), 1);

		expect(component.displayedColumns.includes('creator.name')).toEqual(false);

		// Click the export button
		await clickExportButton();

		const expectedColumnNames = ['created', 'body', 'status', 'assignee'];
		const expectedColumns = component.columns
			.filter((column) => expectedColumnNames.includes(column.key))
			.map((column) => {
				return { key: column.key, title: column.label };
			});

		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledWith('feedback', {
			q: {},
			s: '',
			sort: 'created',
			dir: 'DESC',
			cols: expectedColumns
		});
	});
});
