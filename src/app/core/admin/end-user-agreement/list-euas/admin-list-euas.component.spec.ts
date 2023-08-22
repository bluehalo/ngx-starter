import { DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { DialogService } from '../../../../common/dialog';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { EuaService } from '../eua.service';
import { AdminListEuasComponent } from './admin-list-euas.component';

describe('Admin List End User Agreements Component', () => {
	let activatedRoute: any;
	let endUserAgreementServiceSpy: any;
	let dialogServiceSpy: any;

	let fixture: ComponentFixture<AdminListEuasComponent>;
	let component: AdminListEuasComponent;

	beforeEach(() => {
		activatedRoute = {
			/* eslint-disable-next-line rxjs/finnish */
			params: of({})
		};
		endUserAgreementServiceSpy = jasmine.createSpyObj('EuaService', ['search']);
		endUserAgreementServiceSpy.search.and.callFake(() => {
			return of(void 0);
		});
		endUserAgreementServiceSpy.cache = {};
		dialogServiceSpy = jasmine.createSpyObj('DialogService', ['alert']);
		dialogServiceSpy.alert.and.callFake(() => {
			return of(void 0);
		});
		const testBed = TestBed.configureTestingModule({
			imports: [AdminListEuasComponent, DialogModule],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRoute },
				{ provide: EuaService, useValue: endUserAgreementServiceSpy },
				{ provide: DialogService, useValue: dialogServiceSpy },
				{ provide: DIALOG_DATA, useValue: {} },
				SystemAlertService
			]
		});
		fixture = testBed.createComponent(AdminListEuasComponent);
		component = fixture.componentInstance;
	});

	it('Should Exist', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('Should Open a Modal When Preview End User Agreement', () => {
		fixture.detectChanges();
		expect(dialogServiceSpy.alert).toHaveBeenCalledTimes(0);
		component.previewEndUserAgreement({});
		expect(dialogServiceSpy.alert).toHaveBeenCalledTimes(1);
	});
});
