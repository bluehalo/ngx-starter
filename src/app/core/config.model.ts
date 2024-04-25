interface AppConfig {
	title: string;
	clientUrl: string;
}

interface ApiDocsConfig {
	enabled: boolean;
	path: string;
}

interface BannerConfig {
	html: string;
	style: string;
}

interface FeedbackConfig {
	showFlyout: boolean;
	showInSidebar: boolean;
	classificationOpts: Array<{ level: string; prefix: string }>;
}

interface TeamConfig {
	implicitMembers: {
		strategy: string;
	};
	nestedTeams?: boolean;
}

interface HelpConfig {
	welcomeLinks: Array<{ href: string; title: string; description: string }>;
}

interface UserPreferencesConfig {
	enabled: boolean;
	path: string;
}

export interface Config {
	auth: string;
	requiredRoles: Array<string>;
	masqueradeEnabled?: boolean;
	masqueradeHeader?: string;

	app: AppConfig;
	version: string;
	contactEmail: string;

	allowDeleteUser: boolean;

	apiDocs: ApiDocsConfig;

	banner: BannerConfig;
	copyright: BannerConfig;

	teams?: TeamConfig;

	feedback?: FeedbackConfig;

	userPreferences?: UserPreferencesConfig;

	help: HelpConfig;
}
