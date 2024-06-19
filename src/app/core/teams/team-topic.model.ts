import { InjectionToken, inject } from '@angular/core';

import sortBy from 'lodash/sortBy';

import { Topic } from '../../common';

export const TEAM_TOPICS = new InjectionToken<Topic[][]>('TEAM_TOPIC');

export const injectTeamTopics: () => Topic[] = () =>
	sortBy((inject(TEAM_TOPICS, { optional: true }) ?? []).flat(), [
		(t) => t.ordinal ?? 1,
		'title',
		'path'
	]);
