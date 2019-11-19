import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavbarTopics } from '../../../core/site-navbar/navbar-topic.model';

import { Series } from '@asymmetrik/sentio';

import { DynamicTimelineDirective, DynamicTimelineReadyEvent } from '@asymmetrik/ngx-sentio';

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ChartComponent {
	now = Date.now();
	oneDay = 24 * 60 * 60 * 1000;
	months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

	quickLinks = [
		{ label: '1d',  value: this.oneDay },
		{ label: '1w',  value: 7 * this.oneDay },
		{ label: '1m',  value: 30 * this.oneDay },
		{ label: '6m',  value: 180 * this.oneDay },
		{ label: '1y',  value: 365 * this.oneDay },
		{ label: '5y',  value: 5 * 365 * this.oneDay },
		{ label: 'all', value: 9999999999 * this.oneDay }
	];

	// Context
	dateString: string;
	valueString: string;

	// Dynamic timeline ref
	@ViewChild(DynamicTimelineDirective, { static: false }) dynamicTimelineRef: DynamicTimelineDirective;

	// Timeline
	timelineData: any[] = [];
	timelineSeries: Series[] = [];

	// Brush
	brushData: any[] = [];
	brushSeries: Series[] = [];

	chartsReady(charts: DynamicTimelineReadyEvent) {
		charts.timeline.dispatch()
			.on('pointMouseover.context', this.updateContextPoint.bind(this))
			.on('pointMouseout.context', this.updateContextNoPoint.bind(this));

		charts.autoBrush.dispatch()
			.on('brushChange.context', this.updateContextNoPoint.bind(this));
	}


	zoom(level: number) {
		this.dynamicTimelineRef.setBrush([ this.now - level, this.now ]);
	}

	getDateString(d: number) {
		let toReturn;

		if (null != d) {
			const dtg = new Date(d);
			toReturn = `${this.months[dtg.getMonth()]} ${dtg.getDate()}, ${dtg.getFullYear()}`;
		}

		return toReturn;
	}

	updateContextPoint(d: any) {
		this.dateString = this.getDateString(d.data[0]);
		this.valueString = `$${d.data[1]}`;
	}

	updateContextNoPoint() {
		const extent = this.dynamicTimelineRef.timeline.xScale().domain();
		if (null != extent) {
			const fromString = this.getDateString(extent[0]);
			const toString = this.getDateString(extent[1]);

			this.dateString = `${fromString} - ${toString}`;
			this.valueString = null;
		}

	}
}


NavbarTopics.registerTopic({
	id: 'charts',
	title: 'Charts',
	ordinal: 3,
	path: 'chart',
	iconClass: 'fa-chart',
	hasSomeRoles: ['user']
});
