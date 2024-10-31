export type EmailNotification = {
	readonly to: string;
	readonly from: string;
	readonly replyTo: string;
	readonly subject: string;
	readonly message: string;
};
