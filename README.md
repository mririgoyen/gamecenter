# Game Center

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

WIP
