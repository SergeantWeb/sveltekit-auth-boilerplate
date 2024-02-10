# SvelteKit Auth Boilerplate

A full-stack authentication boilerplate with SvelteKit, MongoDB, TypeScript, JWT.

## Features
- Register with an email address, username, password, and accept ToS and Privacy Policy.
- Login with a username or email, and password (Using a server-side read-only cookie).
- Logout.

### Optional Features
Optional features can be (un)set using environment variables. If the variable is set to 1, it's activated; otherwise, it's disabled.
- Enable or disable registration (env: `PUBLIC_ALLOW_REGISTRATION`).
- Account activation with a link sent by email (env: `PUBLIC_ACCOUNT_ACTIVATION`).
- Reset password with a link sent by email (env: `PUBLIC_ALLOW_PASSWORD_RESET`).

## Used Libraries
### UI
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Unplugin-icons / Iconify](https://github.com/antfu/unplugin-icons) with Remix Icons (used for the Alert component)
### Auth
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing.
- [JsonWebToken](https://github.com/auth0/node-jsonwebtoken) for JWT.
- [nodemailer](https://github.com/nodemailer/nodemailer) for sending an email for account activation & password reset.
### Other
- [validator](https://github.com/validatorjs/validator.js) to validate field values.
- [dotenv](https://github.com/motdotla/dotenv) used to read public environment variables server-side.
- [mongoose](https://mongoosejs.com/) for the MongoDB Database.

## Account Registration
`/auth/register`

Register an account with an email address, a username, a password, and accept the ToS & Privacy Policy.

The Terms of Service page is available at the route `/terms`.
The Privacy Policy page is available at the route `/privacy-policy`.

#### Fields Validation
Fields are validated using the `validator` library.
- Email validation can be found at `/lib/server/validation.ts`.
- Username validation can be found at `/lib/server/services/AuthService.ts`.
- Password validation can be found at `/lib/server/validation.ts`.

## Optional Feature: Account Activation Link
If the activation feature is enabled (`PUBLIC_ACCOUNT_ACTIVATION`), an email is sent using `nodemailer` and the email template (c.f. `static/email-templates/base.html`).

## Login
`/auth/login`

Users can log in using their email address or username.

Once logged in, a server-side read-only cookie containing a JWT is created.

The JWT contains a session token that should correspond to the `sessionToken` of a user in the database.

## Logout
`/auth/logout`

Logout will simply log the user out by resetting the cookie expiration date.

## Reset Password
`/auth/reset-password`

This optional feature permits resetting the password of an account by providing its associated email address.

A link is sent by email, and this link has the following structure: `/auth/reset-password?code=The-Reset-Token-Here`.

The reset password token has an expiration time of 30 minutes (c.f. `/lib/server/services/AuthService.ts`).

# User store
A user `store` is available at `$lib/front/stores`, it can be used to display user data on the frontend.

# Data transformation & utils
This boilerplate includes several utilities :
- EntityService `/lib/server/services/EntityService.ts` used to do database queries without duplicate the code for each entity.
- serverUtils `/lib/server/serverUtils.ts` used to format data from database : remove sensitive data & transform `_id` ObjectId to `id` string.
Also includes a function to retrieve current user from cookies.


# Getting Started
Clone the boilerplate as usual

```
git clone https://github.com/SergeantWeb/sveltekit-auth-boilerplate
```

Install dependencies using npm
```
npm i
```

Setup environment variables
```
cp .env.example .env
```

Run the SvelteKit project as usual
```
npm run dev
or
npm run build && npm run preview
```