import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subject, of } from 'rxjs';

import { PagingResults } from '../../../common/paging.model';
import { Message, MessageType } from '../message.model';
import { MessageService } from '../message.service';
import { ViewAllMessagesComponent } from './view-all-messages.component';

describe('View All Messages Component Spec', () => {
	const now = new Date().toISOString();
	let messageServiceSpy: any;
	const messageResultsSpec: PagingResults<Message> = {
		elements: [
			new Message({
				_id: 'some-id',
				title: 'THIS is a Test Message',
				type: MessageType.INFO,
				body: 'Here is some body contents with <b>HTML</b>',
				updated: now,
				created: now,
				creator: 'testuser'
			})
		],
		totalPages: 1,
		totalSize: 1,
		pageNumber: 0,
		pageSize: 20
	};

	let fixture: ComponentFixture<ViewAllMessagesComponent>;
	let component: ViewAllMessagesComponent;
	let rootHTMLElement: HTMLElement;

	beforeEach(async () => {
		// reset for each test
		messageServiceSpy = jasmine.createSpyObj('MessageService', ['search', 'messageReceived']);
		messageServiceSpy.messageReceived = new Subject<Message>();
		messageServiceSpy.search.and.callFake(() => {
			return of(messageResultsSpec);
		});

		TestBed.configureTestingModule({
			imports: [ViewAllMessagesComponent],
			providers: [{ provide: MessageService, useValue: messageServiceSpy }]
		});

		fixture = TestBed.createComponent(ViewAllMessagesComponent);
		component = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
	});

	it('should initialize the message listing', async () => {
		expect(messageServiceSpy.search).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		await fixture.whenStable();
		expect(messageServiceSpy.search).toHaveBeenCalledTimes(1);
		const expectedMessage = {
			_id: 'some-id',
			title: 'THIS is a Test Message',
			type: MessageType.INFO,
			body: 'Here is some body contents with <b>HTML</b>',
			updated: now,
			created: now,
			creator: 'testuser'
		};
		expect(component.messages()).toEqual([new Message(expectedMessage)]);

		expect(rootHTMLElement.querySelector('.card-title')?.textContent).toEqual(
			'THIS is a Test Message'
		);
		// should render as HTML, so text content would not include the bold tag
		expect(rootHTMLElement.querySelector('.card-body > p')?.textContent).toEqual(
			'Here is some body contents with HTML'
		);
		// should render as HTML, so HTML content would include the bold tag
		expect(rootHTMLElement.querySelector('.card-body > p')?.innerHTML).toEqual(
			expectedMessage.body
		);
	});
});
