export class SortDirection {
	public static desc: string = 'DESC';
	public static asc: string = 'ASC';
}

export class SortDisplayOption {
	constructor(
		public label?: string,
		public sortField?: string | string[],
		public sortDir?: SortDirection
	) {}

	public setFromModel(model: any) {
		if (model != null) {
			this.sortField = model.field;
			this.sortDir = model.direction;
		}
		return this;
	}
}
