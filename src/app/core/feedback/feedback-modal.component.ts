import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import { BsModalRef } from 'ngx-bootstrap';
import { first as rxjsFirst } from 'rxjs/operators';

import { ConfigService } from '../config.service';
import { StringUtils } from '../../common/string-utils.service';
import { FeedbackService } from './feedback.service';

@Component({
	templateUrl: 'feedback-modal.component.html'
})
export class FeedbackModalComponent implements OnInit {

	error: string;

	success: string;

	feedbackText: string;

	submitting: boolean = false;

	allTypeOption: any[] = FeedbackService.feedbackTypes;

	selectedOption: any = this.allTypeOption[0];

	classificationOptions: any[];

	selectedClassification: any = {};

	private currentRoute: string;

	constructor(
		private router: Router,
		private configService: ConfigService,
		private feedbackService: FeedbackService,
		public modalRef: BsModalRef
	) {}

	ngOnInit() {
		this.configService.getConfig().pipe(rxjsFirst()).subscribe((config: any) => {
			this.currentRoute = `${config.app.baseUrl || ''}${this.router.url}`;

			if (Array.isArray(config.feedbackClassificationOpts) && !isEmpty(config.feedbackClassificationOpts)) {
				this.classificationOptions = config.feedbackClassificationOpts;
				this.selectedClassification = first(this.classificationOptions);
			}
		});
	}

	submit() {
		if (StringUtils.isNonEmptyString(this.feedbackText)) {
			this.error = null;
			this.submitting = true;
			this.feedbackService.submit(this.feedbackText, this.selectedOption.name, this.currentRoute, 'level' in this.selectedClassification ? this.selectedClassification.level : undefined ).subscribe(() => {
				this.success = 'Feedback successfully submitted!';
				setTimeout(() => this.modalRef.hide(), 1500);
			}, (error: HttpErrorResponse) => {
				this.submitting = false;
				this.error = error.error.message;
			});
		}
		else {
			this.error = 'Cannot submit empty feedback.';
		}
	}
}
