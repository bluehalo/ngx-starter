import { DialogModule } from '@angular/cdk/dialog';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { PagingResults } from '../../../../common/paging.model';
import { User } from '../../../auth/user.model';
import { APP_CONFIG } from '../../../config.service';
import { ExportConfigService } from '../../../export-config.service';
import { AdminUsersService } from '../admin-users.service';
import { AdminListUsersComponent } from './admin-list-users.component';

describe('Admin List Users Component Spec', () => {
	let adminUsersServiceSpy: any;
	let exportConfigServiceSpy: any;
	let exportResponseId: string;

	const mockUsers: PagingResults<User> = {
		elements: [],
		totalPages: 1,
		totalSize: 0,
		pageNumber: 0,
		pageSize: 20
	};

	let fixture: ComponentFixture<AdminListUsersComponent>;
	let component: AdminListUsersComponent;
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
		adminUsersServiceSpy = jasmine.createSpyObj('AdminUsersService', ['search']);
		adminUsersServiceSpy.search.and.returnValue(of(mockUsers));

		exportConfigServiceSpy = jasmine.createSpyObj('ExportConfigService', ['postExportConfig']);
		exportConfigServiceSpy.postExportConfig.and.returnValue(
			of({
				_id: exportResponseId
			})
		);

		TestBed.configureTestingModule({
			imports: [
				RouterModule.forRoot([]),
				BrowserAnimationsModule,
				DialogModule,
				AdminListUsersComponent
			],
			providers: [
				{ provide: AdminUsersService, useValue: adminUsersServiceSpy },
				{ provide: APP_CONFIG, useValue: signal({}) },
				{ provide: ExportConfigService, useValue: exportConfigServiceSpy }
			]
		});

		fixture = TestBed.createComponent(AdminListUsersComponent);
		component = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
	});

	it('should initialize the users listing', async () => {
		expect(adminUsersServiceSpy.search).toHaveBeenCalledTimes(0);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		await fixture.whenStable();
		expect(adminUsersServiceSpy.search).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);
	});

	it('should enable the email column and export the current view', async () => {
		expect(adminUsersServiceSpy.search).toHaveBeenCalledTimes(0);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(adminUsersServiceSpy.search).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);

		// add email to the column list
		component.displayedColumns.push('email');

		expect(component.displayedColumns.includes('name')).toEqual(true);
		expect(component.displayedColumns.includes('email')).toEqual(true);

		// Click the export button
		await clickExportButton();

		const expectedBaseColumnNames = ['name', 'username', 'lastLogin', 'email', 'roles'];
		const expectedColumns = component.columns
			.filter((column) => expectedBaseColumnNames.includes(column.key))
			.map((column) => {
				return { key: column.key, title: column.label };
			});

		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledWith('user', {
			q: {},
			s: '',
			sort: 'lastLogin',
			dir: 'DESC',
			cols: expectedColumns
		});
	});

	it('should disable the roles column and export the current view', async () => {
		expect(adminUsersServiceSpy.search).toHaveBeenCalledTimes(0);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		await fixture.whenStable();

		expect(adminUsersServiceSpy.search).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(0);

		// Toggle the Roles filter off
		component.displayedColumns.splice(component.displayedColumns.indexOf('roles'), 1);

		expect(component.displayedColumns.includes('name')).toEqual(true);
		expect(component.displayedColumns.includes('email')).toEqual(false);
		expect(component.displayedColumns.includes('roles')).toEqual(false);

		// Click the export button
		await clickExportButton();

		const expectedColumnNames = ['name', 'username', 'lastLogin'];
		const expectedColumns = component.columns
			.filter((column) => expectedColumnNames.includes(column.key))
			.map((column) => {
				return { key: column.key, title: column.label };
			});

		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledTimes(1);
		expect(exportConfigServiceSpy.postExportConfig).toHaveBeenCalledWith('user', {
			q: {},
			s: '',
			sort: 'lastLogin',
			dir: 'DESC',
			cols: expectedColumns
		});
	});
});
