## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

### AI

Use ai/start-session.js to start a new session. `node ai/start-session.js`
This will create a current_session.md file in the ai/context directory.
Update the tasks.md file with the current tasks.
Update the roadmap.md file with the current roadmap.
Also generate the context files for the current task. - codebase_instructions.md - tasks.md - tech_stack.md

Use ai/end-session.js to end the current session. `node ai/end-session.js`
This will create a new archive directory with the current_session.md file.
It will also update the roadmap.md file with the current roadmap.

Here is sample prompt to start a new session:

```
# Project Context
[Insert content from project_structure.md]
[Insert content from dependencies.md]
[Insert content from instructions.md]

# Current Task
Implement user authentication feature as per the roadmap.

# Instructions
- Use existing files in the `src` directory.
- Follow code formatting guidelines.
- Ensure the feature integrates with current routing setup.

```
