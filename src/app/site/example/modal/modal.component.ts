import { Component, OnInit } from '@angular/core';
import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';
import { ModalService } from '../../../common/modal.module';
import { ModalConfig } from '../../../common/modal/modal.model';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {
	constructor(public modalService: ModalService) {}

	alertConfig: any = {
		title: 'Alert!',
		message: 'Something important happened!'
	};

	confirmConfig: any = {
		title: 'Confirm?',
		message: 'Are you sure?'
	};

	promptConfig: any = {
		title: 'Prompt',
		message: 'Are you sure?',
		inputLabel: 'Input'
	};

	showConfig: ModalConfig = {
		title: 'Custom Input',
		message: 'Are you sure?',
		okText: 'OK',
		cancelText: 'Cancel'
	};
	showInputConfig = `[
	{ "type": "text", "label": "Field 1", "key": "field1", "required": true },
	{ "type": "textarea", "label": "Field 2", "key": "field2", "required": true }
]`;

	ngOnInit() {}

	showAlert() {
		this.modalService.alert(
			this.alertConfig.title,
			this.alertConfig.message,
			this.alertConfig.okText
		);
	}

	showConfirm() {
		this.modalService.confirm(
			this.confirmConfig.title,
			this.confirmConfig.message,
			this.confirmConfig.okText,
			this.confirmConfig.cancelText
		);
	}

	showPrompt() {
		this.modalService.prompt(
			this.promptConfig.title,
			this.promptConfig.message,
			this.promptConfig.inputLabel,
			this.promptConfig.okText,
			this.promptConfig.cancelText
		);
	}

	showModal() {
		this.showConfig.inputs = JSON.parse(this.showInputConfig);
		this.modalService.show(this.showConfig);
	}
}

NavbarTopics.registerTopic({
	id: 'modals',
	title: 'Modals',
	ordinal: 3,
	path: 'modal',
	iconClass: 'fa-window-restore',
	hasSomeRoles: ['user']
});
