import {
	Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, Input, ViewChild,
	ViewContainerRef
} from '@angular/core';
import * as _ from 'lodash';
import { StringUtils } from '../../common/string-utils.service';

export class HelpTopics {
	static topics: any = {};
	private static topicOrder: any = {};

	static registerTopic(key: string, topicComponent: any, ordinal?: number) {
		HelpTopics.topics[key] = topicComponent;
		this.topicOrder[key] = { key: key, ordinal: ordinal };
	}

	static getTopicList(): string[] {
		return _.values(this.topicOrder).sort((a, b) => a.ordinal - b.ordinal).map((v) => v.key);
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
	@ViewChild('content', { read: ViewContainerRef }) content: ViewContainerRef;

	@Input()
	set key(key: string) {
		if (null != this.componentRef) {
			this.componentRef.destroy();
		}

		if (null != key && null != HelpTopics.topics[key]) {
			// Dynamically create the component
			let factory: ComponentFactory<HelpTopicComponent> = this.resolver.resolveComponentFactory(HelpTopics.topics[key]);
			this.componentRef = this.content.createComponent(factory);
		}
		else {
			console.log(`WARNING: No handler for help topic: ${key}.`);
		}
	}

	componentRef: ComponentRef<any>;

	constructor(private resolver: ComponentFactoryResolver) { }
}
