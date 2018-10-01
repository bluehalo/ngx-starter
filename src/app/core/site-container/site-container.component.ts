import { Component } from '@angular/core';

import * as _ from 'lodash';

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

	constructor(private configService: ConfigService) {
		configService.getConfig().subscribe((config: Config) => {
			this.bannerHtml = _.get(config, 'banner.html', undefined);
			this.copyrightHtml = _.get(config, 'copyright.html', undefined);
		});
	}

}
