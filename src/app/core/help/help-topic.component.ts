import {
	Component,
	ComponentRef,
	InjectionToken,
	Input,
	ViewContainerRef,
	inject,
	viewChild
} from '@angular/core';

import sortBy from 'lodash/sortBy';

import { StringUtils } from '../../common/string-utils.service';

type HelpTopic = { id: string; component: any; title?: string; ordinal?: number };

export const HELP_TOPICS = new InjectionToken<HelpTopic[][]>('HELP_TOPIC');

export const injectHelpTopics: () => HelpTopic[] = () =>
	sortBy(
		(inject(HELP_TOPICS, { optional: true }) ?? [])
			.flat()
			.map(
				(topic) => ({ title: StringUtils.hyphenToHuman(topic.id), ...topic }) as HelpTopic
			),
		[(t) => t.ordinal ?? 1, 'key']
	);

export const injectHelpTopicsMap = () =>
	new Map(injectHelpTopics().map((topic) => [topic.id, topic]));

@Component({
	selector: 'help-topic',
	template: '<div #content></div>',
	standalone: true
})
export class HelpTopicComponent {
	readonly content = viewChild.required('content', { read: ViewContainerRef });

	componentRef?: ComponentRef<any>;

	helpTopics = injectHelpTopicsMap();

	@Input({ required: true })
	set key(key: string) {
		if (this.componentRef) {
			this.componentRef.destroy();
		}

		if (this.content && key && this.helpTopics.has(key)) {
			// Dynamically create the component
			this.componentRef = this.content().createComponent(this.helpTopics.get(key)?.component);
		} else {
			console.warn(`WARNING: No handler for help topic: ${key}.`);
		}
	}
}
