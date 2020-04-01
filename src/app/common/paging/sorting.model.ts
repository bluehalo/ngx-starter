export class SortDirection {
	public static readonly desc = 'DESC';
	public static readonly asc = 'ASC';
}

export type SortDir = 'DESC' | 'ASC';

export interface SortChange {
	sortField: string | string[];
	sortDir: SortDir;
}

export class SortDisplayOption {
	constructor(
		public label?: string,
		public sortField?: string | string[],
		public sortDir?: SortDir
	) {}

	public setFromModel(model: any) {
		if (model != null) {
			this.sortField = model.field;
			this.sortDir = model.direction;
		}
		return this;
	}
}
