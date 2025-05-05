# Next.js Auth From Scratch

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

⚠️ _Made for educational purposes only, don't actually use this lol_

A simple Next.js application with Session auth.

## Prerequisites

- Bun
- MySQL

## Installation

1. Install dependencies:
   ```
   $ bun i
   ```
2. Create a database (MySQL):
   ```mysql
   CREATE DATABASE auth_from_scratch;
   ```
3. Copy `.env.example`, rename it to `.env` and fill out the database URL:
   ```
   cp .env.example .env
   ```
4. Migrate the database:
   ```
   bunx drizzle-kit push
   ```
5. Run the development server:
   ```
   bun run dev
   ```

## How does it work?

### Creating the session

When a user logs in, the server checks for an email/password match, using the `bcrypt.compare` function. If there's a match, a session token is created (128 characters long). This session token will be set as a cookie. The session gets saved in the database, along with the user id.

### Verirfying the session

The server can check if the session is valid by searching for the session with the corresponding session id in the database. If there's no valid session, the server action removes the `session_id` cookie and redirects to `/login`
