import { Routes } from '@angular/router';

import { ListCacheEntriesComponent } from './list-cache-entries/list-cache-entries.component';

export const ADMIN_CACHE_ENTRIES_ROUTES: Routes = [
	{
		path: 'cacheEntries',
		component: ListCacheEntriesComponent
	}
];
