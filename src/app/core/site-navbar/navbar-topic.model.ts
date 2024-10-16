import { InjectionToken, inject } from '@angular/core';

import sortBy from 'lodash/sortBy';

import { Topic } from '../../common';

export interface NavbarTopic extends Topic {
	iconClass: string;
	hasSomeRoles: string[];
}

export const NAVBAR_TOPICS = new InjectionToken<NavbarTopic[][]>('NAVBAR_TOPIC');

export const injectNavbarTopics: () => Array<NavbarTopic> = () =>
	sortBy((inject(NAVBAR_TOPICS, { optional: true }) ?? []).flat(), [
		(t) => t.ordinal ?? 1,
		'title',
		'path'
	]);
