import { DialogModule } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { DialogService } from '../../../../common/dialog';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { Message, MessageType } from '../../../messages/message.model';
import { MessageService } from '../../../messages/message.service';
import { ManageMessageComponent } from './manage-message.component';

describe('ManageMessageComponent', () => {
	let component: ManageMessageComponent;
	let fixture: ComponentFixture<ManageMessageComponent>;
	let rootHTMLElement: HTMLElement;

	let messageServiceSpy: any;
	let dialogServiceSpy: any;

	const dateTime = new Date().toISOString();
	const message: Message[] = [
		new Message().setFromModel({
			_id: '1234567890',
			title: 'Test Message',
			type: MessageType.INFO,
			body: '<b>Test Message</b>',
			updated: dateTime,
			created: dateTime,
			creator: 'Test Creator'
		})
	];

	beforeEach(() => {
		messageServiceSpy = jasmine.createSpyObj('MessageService', ['create']);
		messageServiceSpy.create.and.callFake(() => {
			return of(message);
		});
		dialogServiceSpy = jasmine.createSpyObj('DialogService', ['alert']);
		dialogServiceSpy.alert.and.callFake(() => {
			return of();
		});

		TestBed.configureTestingModule({
			imports: [ManageMessageComponent, RouterTestingModule, DialogModule],
			providers: [
				{ provide: MessageService, useValue: messageServiceSpy },
				{ provide: DialogService, useValue: dialogServiceSpy },
				SystemAlertService
			]
		});
		fixture = TestBed.createComponent(ManageMessageComponent);
		component = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Should Have a Preview Button', () => {
		fixture.detectChanges();
		const buttons = rootHTMLElement.querySelectorAll('button');

		let foundPreviewButton = false;
		buttons.forEach((button) => {
			if (button.innerText === 'Preview') {
				foundPreviewButton = true;
			}
		});
		expect(foundPreviewButton).toBeTrue();
	});

	it('Should Open a Modal When Preview Message', () => {
		fixture.detectChanges();
		expect(dialogServiceSpy.alert).toHaveBeenCalledTimes(0);
		component.previewMessage();
		expect(dialogServiceSpy.alert).toHaveBeenCalledTimes(1);
	});
});
