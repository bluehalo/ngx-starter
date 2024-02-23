export interface ErrorState {
	status?: number;
	statusText: string;
	url?: string | null;
	message?: string;
	stack?: string;
}
