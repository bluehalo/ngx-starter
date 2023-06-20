import { Title } from '@angular/platform-browser';

import { ConfigService } from './config.service';
import { PageTitleStrategy } from './page-title.strategy';

describe('PageTitleStrategy', () => {
	describe('generatePathTitle', () => {
		it('should return title derived from url', () => {
			const service = new PageTitleStrategy(
				null as unknown as Title,
				null as unknown as ConfigService
			);

			let title = service.buildTitleFromUrl('/test');
			expect(title).toEqual('Test');

			title = service.buildTitleFromUrl('/test/id');
			expect(title).toEqual('Test > Id');

			title = service.buildTitleFromUrl('/really/long/url/path/to/parse');
			expect(title).toEqual('Really > Long > Url > Path > To > Parse');
		});
	});
});
