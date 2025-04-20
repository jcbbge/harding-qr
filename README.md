# SolidJS Starter Template

A clean, minimal SolidJS starter template with routing and TailwindCSS pre-configured.

## Features

- 🚀 [SolidJS](https://www.solidjs.com/) for reactive UI
- 🛣️ [@solidjs/router](https://github.com/solidjs/solid-router) for routing
- 🎨 [TailwindCSS](https://tailwindcss.com/) for styling
- ⚡️ [Vite](https://vitejs.dev/) for fast development
- 🔧 [Prettier](https://prettier.io/) for code formatting

## Getting Started

1. Clone the repository:

```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Project Structure

```
├── docs/
│   └── templates/          # Development and debugging guides
├── public/
│   └── assets/            # Static assets
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app component
│   ├── index.jsx         # App entry point
│   └── index.css         # Global styles
├── index.html            # HTML entry point
├── package.json          # Project dependencies
├── vite.config.mjs       # Vite configuration
└── README.md            # Project documentation
```

## Development Guides

Check the `docs/templates` directory for:

- Feature Development Guide
- Debugging Guide

## License

MIT

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

~/.bashrc
tabxnavigator

---

09/30/2024
cloned a python cli tool called o1-eng. set up a virtual environment and installed the dependencies. added the venv to .gitignore. Follow these steps to get setup:

# Navigate to your project directory

cd ~/webdevelopment/solidjs/jrg-portfolio

# Create a new virtual environment

python3 -m venv venv

# Activate the virtual environment

source venv/bin/activate

# Deactivate the virtual environment

deactivate

# Install a package

pip install package_name

# Install multiple packages

pip install package1 package2 package3

# Install packages from requirements.txt

pip install -r requirements.txt

# Create or update requirements.txt

pip freeze > requirements.txt

# Run your script (from any directory)

python ~/webdevelopment/o1-engineer/o1-eng.py

# Run your script (from the script's directory)

cd ~/webdevelopment/o1-engineer
python o1-eng.py

# Activate venv from a different directory

source ~/webdevelopment/solidjs/jrg-portfolio/venv/bin/activate

# Check installed packages

pip list

# Check Python version

python --version

# Check where Python is installed

which python

# Check sys.path (Python's search path for modules)

python -c "import sys; print('\n'.join(sys.path))"

# Remember: Always activate your virtual environment before working on your project!

```

# Harding QR

<!-- Test deployment trigger -->
```
