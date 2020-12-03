import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ModalModule } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { ModalService } from 'src/app/common/modal.module';
import { SystemAlertService } from 'src/app/common/system-alert.module';
import { AdminListEuasComponent } from './admin-list-euas.component';
import { EuaService } from './eua.service';

describe('Admin List End User Agreements Component', () => {
	let activatedRoute: any;
	let endUserAgreementServiceSpy: any;
	let modalServiceSpy: any;

	let fixture: ComponentFixture<AdminListEuasComponent>;
	let rootHTMLElement: HTMLElement;
	let component: AdminListEuasComponent;

	beforeEach(() => {
		activatedRoute = {
			params: of({})
		};
		endUserAgreementServiceSpy = jasmine.createSpyObj('EuaService', ['search']);
		endUserAgreementServiceSpy.search.and.callFake(() => {
			return of();
		});
		endUserAgreementServiceSpy.cache = {};
		modalServiceSpy = jasmine.createSpyObj('ModalService', ['alert']);
		modalServiceSpy.alert.and.callFake(() => {
			return of();
		});
		const testBed = TestBed.configureTestingModule({
			declarations: [AdminListEuasComponent],
			imports: [ModalModule.forRoot(), RouterTestingModule],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRoute },
				{ provide: EuaService, useValue: endUserAgreementServiceSpy },
				{ provide: ModalService, useValue: modalServiceSpy },
				SystemAlertService
			]
		});
		fixture = testBed.createComponent(AdminListEuasComponent);
		component = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
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
