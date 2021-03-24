import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { of } from 'rxjs';
import { PagingModule, PagingResults } from 'src/app/common/paging.module';
import { PipesModule } from 'src/app/common/pipes.module';
import { SearchInputModule } from 'src/app/common/search-input.module';
import { SystemAlertModule } from 'src/app/common/system-alert.module';
import { User } from '../../auth/user.model';
import { ConfigService } from '../../config.service';
import { ExportConfigService } from '../../export-config.service';
import { FeedbackService } from '../../feedback/feedback.service';
import { AdminUsersService } from '../user-management/admin-users.service';
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

	const toggleColumnCheckbox = async (checkboxLabel: string) => {
		const allColumnCheckboxes = rootHTMLElement.querySelectorAll(
			'.quick-select-header > .form-check > .form-check-label'
		);
		// default to the first element, then actually find the checkbox
		let columnButton = allColumnCheckboxes.item(0);
		allColumnCheckboxes.forEach(e => {
			if (e.textContent === checkboxLabel) {
				columnButton = e;
			}
		});
		columnButton.parentElement.querySelector('input').click();
		fixture.detectChanges();
		await fixture.whenStable();
	};

	const clickExportButton = async () => {
		const exportButtonElement = rootHTMLElement.querySelector('span.fa-download').parentElement;
		expect(exportButtonElement.textContent.trim()).toEqual('Export');
		exportButtonElement.click();
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
				PagingModule,
				PipesModule,
				SearchInputModule,
				SystemAlertModule,
				TooltipModule.forRoot()
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
		await toggleColumnCheckbox('Email');
		expect(component.columns['creator.email'].show).toEqual(true);

		// Click the export button
		await clickExportButton();

		const expectedColumns = [
			'creator.name',
			'creator.email',
			'created',
			'body',
			'status',
			'assignee'
		].map(key => {
			return { key, title: component.columns[key].display };
		});

		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledWith('feedback', {
			q: undefined,
			s: undefined,
			cols: expectedColumns,
			sort: 'created',
			dir: 'DESC'
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
		await toggleColumnCheckbox('Submitted By');

		expect(component.columns['creator.name'].show).toEqual(false);

		// Click the export button
		await clickExportButton();

		const expectedColumns = ['created', 'body', 'status', 'assignee'].map(key => {
			return { key, title: component.columns[key].display };
		});

		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledWith('feedback', {
			q: undefined,
			s: undefined,
			cols: expectedColumns,
			sort: 'created',
			dir: 'DESC'
		});
	});
});
