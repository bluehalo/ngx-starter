import { Routes } from '@angular/router';

import { CacheEntriesComponent } from './cache-entries.component';

export const ADMIN_CACHE_ENTRIES_ROUTES: Routes = [
	{
		path: 'cacheEntries',
		component: CacheEntriesComponent
	}
];
