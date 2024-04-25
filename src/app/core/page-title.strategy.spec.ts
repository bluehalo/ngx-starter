import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { APP_CONFIG } from './config.service';
import { PageTitleStrategy } from './page-title.strategy';

describe('PageTitleStrategy', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				PageTitleStrategy,
				{ provide: APP_CONFIG, useValue: signal({}) },
				{ provide: Title, useValue: null }
			]
		});
	});

	describe('buildTitleFromUrl', () => {
		it('should return title derived from url', () => {
			const strategy = TestBed.inject(PageTitleStrategy);

			let title = strategy.buildTitleFromUrl('/test');
			expect(title).toEqual('Test');

			title = strategy.buildTitleFromUrl('/test/id');
			expect(title).toEqual('Test > Id');

			title = strategy.buildTitleFromUrl('/really/long/url/path/to/parse');
			expect(title).toEqual('Really > Long > Url > Path > To > Parse');
		});
	});
});
