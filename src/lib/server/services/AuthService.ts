import type { User } from '$lib/server/models/UserModel';
import { PUBLIC_URL, PUBLIC_ALLOW_REGISTRATION } from '$env/static/public';
import { JWT_TOKEN, SMTP_EMAIL } from '$env/static/private';
import crypto from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import UserModel from '$lib/server/models/UserModel';
import MailService from '$lib/server/services/MailService';
import validation from '$lib/server/validation';
import serverUtils from '$lib/server/serverUtils';

const AuthService = {
	/**
	 * Register a new user
	 * @param userData
	 */
	register: async (userData: Partial<User>, redirectTo?: string): Promise<void> => {
		const user = new UserModel();
		user.email = userData.email;
		user.username = userData.username;
		user.password = await bcrypt.hash(userData.password as string, 6);

		// Validation
		// Check if registration is allowed
		if (['0', 'false'].includes(PUBLIC_ALLOW_REGISTRATION)) {
			throw {
				error: 'Registration is closed'
			};
		}

		// Validate email
		validation.validateEmail(user.email);
		const emailExists = await UserModel.findOne({ email: user.email });
		if (emailExists !== null) {
			throw {
				email: 'This email address is already used'
			};
		}

		// Validate username
		if (
			!validator.isLength(user.username, { min: 3, max: 14 }) ||
			!validator.isAlphanumeric(user.username)
		) {
			throw {
				username: 'This username is incorrect'
			};
		}
		const usernameExists = await UserModel.findOne({ username: user.username });
		if (usernameExists !== null) {
			throw {
				username: 'This username is already used'
			};
		}

		// Validate password
		validation.validatePassword(userData.password, userData.confirmation);

		if (!userData.terms) {
			throw {
				terms: 'Please accept the Terms of Service'
			};
		}

		// If activation is needed, send activation link
		if (!['0', 'false'].includes(process?.env?.PUBLIC_ACCOUNT_ACTIVATION as string)) {
			user.activationToken = crypto.randomUUID();
			if (process?.env?.VITEST !== 'true') {
				await MailService.sendMail({
					from: SMTP_EMAIL,
					to: user.email,
					subject: 'Activate your account',
					html: MailService.getEmailTemplate({
						title: 'Thank you for Registration!',
						description:
							'You are just one step away from completing your registration, activate your account by clicking the button below',
						button: {
							label: 'Activate your account',
							link: PUBLIC_URL + '/auth/activate-account?code=' + user.activationToken + (redirectTo ? `&redirect_to=${redirectTo}` : '')
						}
					})
				});
			}
		} else {
			user.activationToken = null;
			user.activated = true;
		}

		await user.save();
	},

	/**
	 * Login a user
	 * @param username
	 * @param password
	 */
	login: async (
		username: string, // Username or email
		password: string
	): Promise<string> => {
		let user = await UserModel.findOne({ username });
		if (!user) {
			user = await UserModel.findOne({ email: username });
			if (!user) {
				throw {
					username: 'User not found'
				};
			}
		}

		if (user.activated === false) {
			throw {
				error: 'This account is not activated'
			};
		}

		const passwordIsValid = await bcrypt.compare(password, user.password);
		if (!passwordIsValid) {
			throw {
				password: 'Password is invalid'
			};
		}

		user.sessionToken = crypto.randomUUID();
		user.sessionExpire = new Date(Date.now() + 24 * 60 * 60 * 1000 * 30);
		await user.save();
		return jsonwebtoken.sign({ session: user.sessionToken }, JWT_TOKEN as string);
	},

	/**
	 * Check session from jwt
	 * @param jwt
	 */
	checkSession: async (
		jwt: string
	): Promise<{ success: boolean; error?: string; user?: Partial<User> }> => {
		const decoded: any = jsonwebtoken.decode(jwt);
		if (!decoded?.session) {
			return { success: false };
		}
		const user = await UserModel.findOne({
			sessionToken: decoded.session
		});
		if (!user) {
			return { success: false };
		}
		if (!user.sessionExpire || user.sessionExpire < new Date()) {
			return { success: false, error: 'session_expired' };
		}
		return {
			success: true,
			user: serverUtils.formatEntry(user)
		};
	},

	/**
	 * Activate an account using the given activationToken
	 * @param activationToken
	 */
	activateAccount: async (
		activationToken: string
	): Promise<{ activated: boolean; error?: string }> => {
		const user = await UserModel.findOne({ activationToken });
		if (!user || !activationToken) {
			return {
				activated: false,
				error:
					'Account not found or already activated. Please attempt to log in, and if the issue persists, contact the administrator'
			};
		}
		user.activationToken = null;
		user.activated = true;
		await user.save();
		return { activated: true };
	},

	/**
	 * Send a password reset link by email
	 * @param email
	 */
	sendResetPasswordLink: async (email: string) => {
		const user = await UserModel.findOne({ email });
		if (user === null) {
			throw {
				error: 'There is no account found for this email'
			};
		}
		user.resetToken = crypto.randomUUID();
		const currentDate = new Date();
		user.resetTokenExpire = new Date(currentDate.getTime() + 30 * 60000); // 30 minutes
		await user.save();
		await MailService.sendMail({
			from: SMTP_EMAIL,
			to: user.email as string,
			subject: 'Reset your password',
			html: MailService.getEmailTemplate({
				title: 'Password reset request for your account',
				description:
					'A password reset request was received for your account. Here is the link to choose a new password. If you did not initiate this password reset request, please delete this email.',
				button: {
					label: 'Reset your password',
					link: PUBLIC_URL + '/auth/reset-password?code=' + user.resetToken
				}
			})
		});
	},

	/**
	 * Check if the given code for password reset is valid
	 * @param resetToken
	 */
	checkResetCode: async (resetToken: string) => {
		if (!resetToken || resetToken.length <= 0) {
			throw {
				error: 'A valid code is needed to reset your password'
			};
		}
		const user = await UserModel.findOne({ resetToken });
		if (user === null) {
			throw {
				error: 'There is no account found for this password reset code'
			};
		}

		if (!user.resetTokenExpire || user.resetTokenExpire < new Date()) {
			throw {
				error: 'This password reset link has expired'
			};
		}
		return user;
	},

	/**
	 * Update the password using for the user corresponding to the given reset code
	 * @param resetToken
	 * @param newPassword
	 */
	newPassword: async (resetCode: string, newPassword: string) => {
		const user = await AuthService.checkResetCode(resetCode);
		user.password = await bcrypt.hash(newPassword, 6);
		user.resetToken = null;
		user.resetTokenExpire = null;
		await user.save();
	}
};

export default AuthService;
