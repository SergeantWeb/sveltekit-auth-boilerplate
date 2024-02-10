import type Mail from 'nodemailer/lib/mailer';
import { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } from '$env/static/private';
import fs from 'fs';
import * as path from 'path';
import nodemailer from 'nodemailer';

export default {
	sendMail: async (emailData: Mail.Options) => {
		try {
			const transporter = nodemailer.createTransport({
				// eslint-disable-next-line
				// @ts-ignore
				host: SMTP_HOST,
				port: SMTP_PORT,
				secure: false,
				auth: {
					user: SMTP_USERNAME,
					pass: SMTP_PASSWORD
				}
			});
			return await transporter.sendMail(emailData);
		} catch (e) {
			console.error(e);
			throw [
				{
					property: 'error',
					constraints: {
						email: 'There was an error while sending the activation email'
					}
				}
			];
		}
	},

	getEmailTemplate: (options: {
		title: string;
		description: string;
		button: {
			label: string;
			link: string;
		};
	}) => {
		const emailContent = fs.readFileSync(
			path.resolve('./static/email-templates/base.html'),
			'utf-8'
		);
		return emailContent
			.replace('{title}', options.title)
			.replace('{description}', options.description)
			.replace('{button_label}', options.button.label)
			.replace('{button_link}', options.button.link);
	}
};
