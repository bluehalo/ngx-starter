interface AppConfig {
	title: string;
}

interface BannerConfig {
	html: string;
	style: string;
}

interface TeamConfig {
	implicitMembers: {
		strategy: string;
	};
}

export interface Config {
	auth: string;

	app: AppConfig;
	version: string;
	contactEmail: string;

	banner: BannerConfig;
	copyright: BannerConfig;

	teams: TeamConfig;
}
