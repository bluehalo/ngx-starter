import { LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

import { Message, MessageType } from '../message.model';

@Component({
	selector: 'app-message',
	standalone: true,
	imports: [LowerCasePipe],
	templateUrl: './message.component.html',
	styleUrl: './message.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'card'
	}
})
export class MessageComponent {
	protected readonly messageType = MessageType;

	readonly message = input.required<Message>();

	readonly truncate = input(false, { transform: booleanAttribute });
}
