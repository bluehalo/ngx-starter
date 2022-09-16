import { CdkTableModule } from '@angular/cdk/table';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ModalModule } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';

import { ModalService } from '../../../../common/modal/modal.service';
import { SearchInputModule } from '../../../../common/search-input.module';
import { SystemAlertModule } from '../../../../common/system-alert.module';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { TableModule } from '../../../../common/table.module';
import { EuaService } from '../eua.service';
import { AdminListEuasComponent } from './admin-list-euas.component';

describe('Admin List End User Agreements Component', () => {
	let activatedRoute: any;
	let endUserAgreementServiceSpy: any;
	let modalServiceSpy: any;

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
		modalServiceSpy = jasmine.createSpyObj('ModalService', ['alert']);
		modalServiceSpy.alert.and.callFake(() => {
			return of(void 0);
		});
		const testBed = TestBed.configureTestingModule({
			declarations: [AdminListEuasComponent],
			imports: [
				ModalModule.forRoot(),
				RouterTestingModule,
				SystemAlertModule,
				SearchInputModule,
				CdkTableModule,
				TableModule
			],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRoute },
				{ provide: EuaService, useValue: endUserAgreementServiceSpy },
				{ provide: ModalService, useValue: modalServiceSpy },
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
		expect(modalServiceSpy.alert).toHaveBeenCalledTimes(0);
		component.previewEndUserAgreement({});
		expect(modalServiceSpy.alert).toHaveBeenCalledTimes(1);
	});
});
