<div align="center">
  <img width="275" height="194" src="screenshot.jpg">
  <h1>GameCenter</h1>
</div>

**IMPORTANT!!!**
There are no game ROMS available in this repository. They will not be provided and no information will be given on how to obtain them under any circumstance.
This repository is meant to serve as a historical archive of the GameCenter and the GameCenter is not currently available online anywhere.

## Background

My previous company, Accusoft, has been participating in the Extra Life fundraiser since 2017. Every year, they hold a classic arcade tournament on game day to bring awareness to our fundraising efforts and to have a bit of fun.

However, the COVID-19 pandemic that started in 2020 forced all employees to work remotely. I didn't want this to prevent the company from coming together on game day this year, so I came up with the idea for the Accusoft GameCenter.

Over the course of about a month, I put together a completely virtual way for the company to come together and play three classic arcade games, right in our browsers. Using the [MAME emulator](https://www.mamedev.org/), [Emscripten](https://emscripten.org/), and a React application I developed (this repository), employees could play each game and their scores would be tracked in real-time.

Leaderboards allowed everyone to get a little competitive, and we had a lot of fun! Other features built into the GameCenter includes an avatar generator and an achievement system.

## Dev Environment

- Required
  - Docker v19+
  - docker-compose v1.26.0+
- Recommended
  - Visual Studio Code

---

## Getting Started

1. Run `npm run local:build` to build the Docker image.
2. Run `npm i` locally. This is to allow webpack to run.
3. Run `npm run local:start`.
4. Add a local HOSTS override: _(This is required because of Google Authentication.)_

    ```bash
    0.0.0.0 dev-gamecenter
    ```

5. The game can be reached at <http://dev-gamecenter>.

When you've completed your dev work, you can stop all running containers by running `npm run local:stop`.

## Managing Dependencies

### Server Dependencies

When you need to add (or remove) a dependency to the server, never run a `npm install` command locally. Instead, use the following command:

- `npm run local:add :packageName` - Install a specific package in the game server

### Client Dependencies

When you need to add (or remove) a dependency to the client, run `npm install` locally.

## Legal

All references to PAC-MAN, Galaga, and Donkey Kong are copyrighted by their respective owners.

The application code contained in this repository is Copyright 2021 Michael Irigoyen.
