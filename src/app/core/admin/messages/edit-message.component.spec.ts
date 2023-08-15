import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { DialogService } from '../../../common/dialog';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { ConfigService } from '../../config.service';
import { Message, MessageType } from '../../messages/message.model';
import { MessageService } from '../../messages/message.service';
import { UpdateMessageComponent } from './edit-message.component';

describe('Update Message Component', () => {
	let configServiceSpy: any;
	let messageServiceSpy: any;
	let dialogServiceSpy: any;

	let fixture: ComponentFixture<UpdateMessageComponent>;
	let rootHTMLElement: HTMLElement;
	let component: UpdateMessageComponent;

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
		configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
		configServiceSpy.getConfig.and.returnValue(of({}));
		messageServiceSpy = jasmine.createSpyObj('MessageService', ['create', 'get']);
		messageServiceSpy.create.and.callFake(() => {
			return of(message);
		});
		messageServiceSpy.get.and.callFake(() => {
			return of(message);
		});
		dialogServiceSpy = jasmine.createSpyObj('DialogService', ['alert']);
		dialogServiceSpy.alert.and.callFake(() => {
			return of();
		});
		const testBed = TestBed.configureTestingModule({
			imports: [RouterTestingModule, UpdateMessageComponent],
			providers: [
				{ provide: ConfigService, useValue: configServiceSpy },
				{ provide: MessageService, useValue: messageServiceSpy },
				{ provide: DialogService, useValue: dialogServiceSpy },
				SystemAlertService
			]
		});
		fixture = testBed.createComponent(UpdateMessageComponent);
		component = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
	});

	it('Should Exist', () => {
		fixture.detectChanges();
		expect(component).toBeDefined();
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
