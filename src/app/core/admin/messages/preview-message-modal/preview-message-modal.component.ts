import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ModalComponent } from '../../../../common';
import { DialogAction } from '../../../../common/dialog';
import { AgoDatePipe } from '../../../../common/pipes';
import { Message, MessageType } from '../../../messages';
import { MessageComponent } from '../../../messages/message/message.component';

export type PreviewMessageModalData = {
	message: Message;
};

@Component({
	selector: 'app-preview-message-modal',
	standalone: true,
	imports: [ModalComponent, AgoDatePipe, LowerCasePipe, MessageComponent],
	templateUrl: './preview-message-modal.component.html',
	styleUrl: './preview-message-modal.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewMessageModalComponent {
	readonly #dialogRef = inject(DialogRef);

	readonly data: PreviewMessageModalData = inject(DIALOG_DATA);

	protected readonly messageType = MessageType;

	close() {
		this.#dialogRef.close({ action: DialogAction.CANCEL });
	}
}
