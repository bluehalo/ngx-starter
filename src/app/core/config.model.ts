interface AppConfig {
	title: string;
}

interface BannerConfig {
	html: string;
	style: string;
}

interface FeedbackConfig {
	showFlyout: boolean;
	showInSidebar: boolean;
}

interface TeamConfig {
	implicitMembers: {
		strategy: string;
	};
}

interface UserPreferencesConfig {
	enabled: boolean;
	path: string;
}

export interface Config {
	auth: string;

	app: AppConfig;
	version: string;
	contactEmail: string;

	banner: BannerConfig;
	copyright: BannerConfig;

	teams: TeamConfig;

	feedback?: FeedbackConfig;

	userPreferences?: UserPreferencesConfig;
}
