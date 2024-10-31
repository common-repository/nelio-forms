export type Attributes = {
	readonly ref: number;
};

export type Form = {
	readonly id: number;
	readonly slug: string;
	readonly type: string;
	readonly title: {
		readonly raw: string;
	};
};
