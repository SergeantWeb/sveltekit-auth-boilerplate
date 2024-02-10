import validator from 'validator';

const validation = {
	/**
	 * Validate an email address
	 * > Check if email type is string
	 * > Check if email length > 0
	 * > Check email using validator.js
	 * @param email
	 */
	validateEmail: (email: string) => {
		if (!validator.isEmail(email)) {
			throw {
				email: 'This email address is invalid'
			};
		}
	},

	/**
	 * Validate a password, and optionally its confirmation
	 * > Validate strong password using validator.js
	 * > Validate confirmation
	 * @param password
	 * @param confirmation
	 */
	validatePassword: (password?: string, confirmation?: string) => {
		if (!password) {
			throw {
				password: 'Password is required'
			};
		}
		if (
			!validator.isStrongPassword(password, {
				minLength: 8,
				minLowercase: 1,
				minUppercase: 1,
				minNumbers: 1,
				minSymbols: 1
			})
		) {
			throw {
				password: 'Password is not strong enough'
			};
		}
		if (password !== confirmation) {
			throw {
				confirmation: 'Password confirmation is incorrect'
			};
		}
	}
};

export default validation;
