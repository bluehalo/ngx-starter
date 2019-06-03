import { Component } from '@angular/core';

import get from 'lodash/get';

import { Config } from '../config.model';
import { ConfigService } from '../config.service';

@Component({
	selector: 'site-container',
	templateUrl: 'site-container.component.html',
	styleUrls: [ 'site-container.component.scss' ]
})
export class SiteContainerComponent {

	bannerHtml = undefined;
	copyrightHtml = undefined;
	showFeedbackFlyout: boolean = false;

	constructor(private configService: ConfigService) {
		configService.getConfig().subscribe((config: Config) => {
			this.bannerHtml = get(config, 'banner.html', undefined);
			this.copyrightHtml = get(config, 'copyright.html', undefined);
			this.showFeedbackFlyout = get(config, 'feedback.showFlyout', false);
		});
	}

}
