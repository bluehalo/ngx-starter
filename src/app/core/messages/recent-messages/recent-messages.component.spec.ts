import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject, Subject, of } from 'rxjs';

import { Message, MessageType } from '../message.model';
import { MessageService } from '../message.service';
import { RecentMessagesComponent } from './recent-messages.component';

describe('Recent Messages Component Spec', () => {
	const now = new Date().toISOString();
	let messageServiceSpy: any;
	const messageResultsSpec: Message[] = [
		new Message({
			_id: 'some-id',
			title: 'THIS is a Test Message',
			type: MessageType.INFO,
			body: 'Here is some body contents with <b>HTML</b>',
			updated: now,
			created: now,
			creator: 'testuser'
		})
	];

	let fixture: ComponentFixture<RecentMessagesComponent>;
	let component: RecentMessagesComponent;
	let rootHTMLElement: HTMLElement;

	beforeEach(async () => {
		// reset for each test
		messageServiceSpy = jasmine.createSpyObj('MessageService', ['search', 'remove', 'recent']);
		messageServiceSpy.messageReceived = new Subject<Message>();
		messageServiceSpy.numMessagesIndicator$ = new BehaviorSubject<number>(0);
		messageServiceSpy.remove.and.returnValue(of({}));
		messageServiceSpy.search.and.callFake(() => {
			return of(messageResultsSpec);
		});
		messageServiceSpy.recent.and.callFake(() => {
			return of(messageResultsSpec);
		});

		TestBed.configureTestingModule({
			imports: [RecentMessagesComponent],
			providers: [{ provide: MessageService, useValue: messageServiceSpy }]
		});

		fixture = TestBed.createComponent(RecentMessagesComponent);
		component = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
	});

	it('should initialize the message listing', async () => {
		expect(messageServiceSpy.recent).toHaveBeenCalledTimes(0);
		fixture.detectChanges();
		await fixture.whenStable();
		expect(messageServiceSpy.recent).toHaveBeenCalledTimes(1);
		const expectedMessage = {
			_id: 'some-id',
			title: 'THIS is a Test Message',
			type: MessageType.INFO,
			body: 'Here is some body contents with <b>HTML</b>',
			updated: now,
			created: now,
			creator: 'testuser'
		};
		expect(component.messages).toEqual([new Message(expectedMessage)]);

		expect(rootHTMLElement.querySelector('.card-title').textContent).toEqual(
			'THIS is a Test Message'
		);
		// should render as HTML, so text content would not include the bold tag
		expect(rootHTMLElement.querySelector('.card-body > p').textContent).toEqual(
			'Here is some body contents with HTML'
		);
		// should render as HTML, so HTML content would include the bold tag
		expect(rootHTMLElement.querySelector('.card-body > p').innerHTML).toEqual(
			expectedMessage.body
		);
	});
});
