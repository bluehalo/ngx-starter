import { Component, OnInit } from '@angular/core';

import isEmpty from 'lodash/isEmpty';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

import { Team } from '../team.model';
import { TeamsService } from '../teams.service';
import { SystemAlertService } from '../../../common/system-alert.module';
import { PagingOptions, PagingResults, SortDirection, SortableTableHeader } from '../../../common/paging.module';

@Component({
	templateUrl: './list-teams.component.html',
	styleUrls: ['./list-teams.component.scss']
})
export class ListTeamsComponent implements OnInit {

	teams: Team[] = [];

	pageSize = 20;

	pagingOptions: PagingOptions = new PagingOptions();

	headers: SortableTableHeader[] = [
		{ name: 'Team Name', sortField: 'name', sortDir: SortDirection.desc, sortable: true, default: true, tooltip: 'Sort by Team Name' },
		{ name: 'Description', sortField: 'description', sortDir: SortDirection.desc, sortable: true, tooltip: 'Sort by Description' },
		{ name: 'Created', sortField: 'created', sortDir: SortDirection.desc, sortable: true, tooltip: 'Sort by Created' }
	];

	search: string;

	pageEvent$: BehaviorSubject<PagingOptions> = new BehaviorSubject(new PagingOptions(0, this.pageSize));

	sortEvent$: BehaviorSubject<SortableTableHeader> = new BehaviorSubject(this.headers.find((header: any) => header.default));

	searchEvent$: BehaviorSubject<string> = new BehaviorSubject<string>(this.search);

	loading = true;

	hasQuery = true;

	private resetPaging = false;

	private load$: BehaviorSubject<boolean> = new BehaviorSubject(true);

	constructor(
		private teamsService: TeamsService,
		private alertService: SystemAlertService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		const paging$ = combineLatest([this.pageEvent$, this.sortEvent$])
			.pipe(
				map(([paging, sort]: [PagingOptions, SortableTableHeader]) => {
					paging.sortField = sort.sortField;
					paging.sortDir = sort.sortDir;
					return paging;
				}),
				tap((paging: PagingOptions) => {
					this.pagingOptions = new PagingOptions(paging.pageNumber, this.pageSize, 0, 0, paging.sortField, paging.sortDir);
				})
			);

		const search$ = this.searchEvent$
			.pipe(
				tap((search: string) => {
					this.resetPaging = true;
					this.search = search;
				})
			);

		combineLatest([this.load$, paging$, search$])
			.pipe(
				map(([, paging, ]: [boolean, PagingOptions, string]) => {
					if (this.resetPaging) {
						paging = new PagingOptions(0, this.pageSize, 0, 0, paging.sortField, paging.sortDir);
					}
					return paging;
				}),
				debounceTime(100),
				switchMap((pagingOpt: PagingOptions) => {
					this.loading = true;
					const query = this.getQuery();
					this.hasQuery = !isEmpty(query) || null != this.search;
					return this.teamsService.search(new PagingOptions(pagingOpt.pageNumber, this.pageSize, 0, 0, pagingOpt.sortField, pagingOpt.sortDir), query, this.search, {});
				})
			).subscribe((result: PagingResults) => {
				this.teams = result.elements;
				if (this.teams.length > 0) {
					this.pagingOptions.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
				} else {
					this.pagingOptions.reset();
				}
				this.resetPaging = false;
				this.loading = false;
			});
	}

	private getQuery(): any {
		const query: any = {};
		return query;
	}

}
