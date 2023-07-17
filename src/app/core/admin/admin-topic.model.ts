import { InjectionToken, inject } from '@angular/core';

import sortBy from 'lodash/sortBy';

import { Topic } from '../../common/topic.model';

export const ADMIN_TOPICS = new InjectionToken<Topic[][]>('ADMIN_TOPIC');

export const getAdminTopics = () =>
	sortBy((inject(ADMIN_TOPICS, { optional: true }) ?? []).flat(), [
		(t) => t.ordinal ?? 1,
		'title',
		'path'
	]);
