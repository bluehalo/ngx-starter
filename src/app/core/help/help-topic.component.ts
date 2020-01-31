import {
	Component,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Input,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import values from 'lodash/values';
import { StringUtils } from '../../common/string-utils.service';

export class HelpTopics {
	static topics: any = {};
	private static topicOrder: any = {};

	static registerTopic(key: string, topicComponent: any, ordinal?: number) {
		HelpTopics.topics[key] = topicComponent;
		this.topicOrder[key] = { key, ordinal };
	}

	static getTopicList(): string[] {
		return values(this.topicOrder)
			.sort((a, b) => a.ordinal - b.ordinal)
			.map(v => v.key);
	}

	static getTopicTitle(title: string, short: boolean = false): string {
		return StringUtils.hyphenToHuman(title);
	}
}

@Component({
	selector: 'help-topic',
	template: '<div #content></div>'
})
export class HelpTopicComponent {
	@ViewChild('content', { read: ViewContainerRef, static: true }) content: ViewContainerRef;

	@Input()
	set key(key: string) {
		if (null != this.componentRef) {
			this.componentRef.destroy();
		}

		if (null != key && null != HelpTopics.topics[key]) {
			// Dynamically create the component
			const factory: ComponentFactory<HelpTopicComponent> = this.resolver.resolveComponentFactory(
				HelpTopics.topics[key]
			);
			this.componentRef = this.content.createComponent(factory);
		} else {
			console.log(`WARNING: No handler for help topic: ${key}.`);
		}
	}

	componentRef: ComponentRef<any>;

	constructor(private resolver: ComponentFactoryResolver) {}
}
