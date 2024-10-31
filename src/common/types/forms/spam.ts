export type SpamSettings =
	| {
			readonly enabled: false;
	  }
	| {
			readonly enabled: true;
			readonly akismet: AkismetSettings;
	  };

export type AkismetSettings =
	| {
			readonly custom: false;
	  }
	| {
			readonly custom: true;
			readonly name: string;
			readonly email: string;
			readonly url: string;
			readonly content: string;
	  };
