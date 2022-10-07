export class SortDirection {
	public static readonly desc = 'DESC';
	public static readonly asc = 'ASC';
}

export type SortDir = 'DESC' | 'ASC';

export interface SortChange {
	sortField: string | string[];
	sortDir: SortDir;
}
