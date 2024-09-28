#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import figlet from 'figlet';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to existing scripts and config
const startSessionScript = path.join(__dirname, 'start-session.js');
const endSessionScript = path.join(__dirname, 'end-session.js');
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');
const sessionFile = path.join(__dirname, 'ai_sessions', 'current_session.md');
const configFile = path.join(__dirname, 'ai-config.json');

// Function to read config
function readConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    if (!config.models) {
      config.models = [{ anthropic: { api_key: undefined, selected: false } }];
    }
    return config;
  } catch (error) {
    return { models: [{ anthropic: { api_key: undefined, selected: false } }] };
  }
}

// Function to write config
function writeConfig(config) {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

// Function to execute a script
function executeScript(scriptPath, args = []) {
  try {
    const result = execSync(`node ${scriptPath} ${args.join(' ')}`, { stdio: 'inherit' });
    console.log(result.toString());
  } catch (error) {
    console.error(`Error executing script: ${error.message}`);
  }
}

// Function to display the welcome message
function displayWelcome() {
  console.log(
    chalk.cyan(
      figlet.textSync('TabXNavigator', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.yellow('Welcome to TabXNavigator - Your AI-powered development assistant\n'));
}

// Main menu function
async function mainMenu() {
  displayWelcome();

  const choices = [
    // { name: chalk.cyan('Start a new session'), value: 'start' },
    // { name: chalk.cyan('End the current session'), value: 'end' },
    // { name: chalk.cyan('Manage tasks'), value: 'tasks' },
    // { name: chalk.yellow('Sync with AI assistant'), value: 'sync' },
    { name: chalk.yellow('Settings'), value: 'settings' },
    { name: chalk.red('Exit'), value: 'exit' }
  ];

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: choices,
      pageSize: 10
    }
  ]);

  switch (action) {
    case 'start':
      await startSession();
      break;
    case 'end':
      await endSession();
      break;
    case 'tasks':
      await tasksMenu();
      break;
    case 'sync':
      await syncAI();
      break;
    case 'settings':
      await settingsMenu();
      break;
    case 'exit':
      console.log(chalk.green('Thank you for using TabXNavigator. Goodbye!'));
      process.exit(0);
  }
}

// Function to handle tasks menu
async function tasksMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Task management:',
      choices: [
        { name: 'Add a new task', value: 'add' },
        { name: 'Update an existing task', value: 'update' },
        { name: 'Back to main menu', value: 'back' }
      ]
    }
  ]);

  switch (action) {
    case 'add':
      await addTask();
      break;
    case 'update':
      await updateTask();
      break;
    case 'back':
      await mainMenu();
      break;
  }
}

// Function to start a new session
async function startSession() {
  executeScript(startSessionScript);
  await mainMenu();
}

// Function to end the current session
async function endSession() {
  executeScript(endSessionScript);
  await mainMenu();
}

// Function to add a new task
async function addTask() {
  const { description } = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'Enter task description:'
    }
  ]);

  const tasks = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));
  tasks.push({ description, done: false, subtasks: [] });
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  console.log(chalk.green('Task added successfully.'));
  await tasksMenu();
}

// Function to update a task
async function updateTask() {
  const tasks = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));
  const choices = tasks.map((task, index) => ({
    name: `${task.description} [${task.done ? 'x' : ' '}]`,
    value: index
  }));

  const { taskIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'taskIndex',
      message: 'Select a task to update:',
      choices: [...choices, { name: 'Back to task menu', value: -1 }]
    }
  ]);

  if (taskIndex === -1) {
    await tasksMenu();
    return;
  }

  const { newDescription } = await inquirer.prompt([
    {
      type: 'input',
      name: 'newDescription',
      message: 'Enter new task description:',
      default: tasks[taskIndex].description
    }
  ]);

  tasks[taskIndex].description = newDescription;
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  console.log(chalk.green('Task updated successfully.'));
  await tasksMenu();
}

// Function to sync with the AI assistant
async function syncAI() {
  const sessionContent = fs.readFileSync(sessionFile, 'utf8');
  console.log('Syncing with AI assistant...');
  // Implement the logic to sync with the AI assistant
  // For example, you can send the session content to the AI assistant's API
  console.log('AI assistant synced.');
  await mainMenu();
}

// Function to display and manage settings
async function settingsMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Settings:',
      choices: [
        { name: 'Select AI Model', value: 'model' },
        { name: 'Back to main menu', value: 'back' }
      ]
    }
  ]);

  switch (action) {
    case 'model':
      await selectModel();
      break;
    case 'back':
      await mainMenu();
      break;
  }
}

// Function to select AI model
async function selectModel() {
  const config = readConfig();
  const currentModel = config.models.find(model => model.anthropic.selected) ? 'Anthropic' : 'Not Set';
  const apiKey = config.models[0].anthropic.api_key || 'Not Set';

  // Mask the API key, showing only the last 5 characters
  const maskedApiKey = apiKey === 'Not Set' ? 'Not Set' : '*'.repeat(apiKey.length - 5) + apiKey.slice(-5);

  console.log(chalk.blue(`Current Model: ${currentModel}`));
  console.log(chalk.blue(`API Key: ${maskedApiKey}`));

  const { model } = await inquirer.prompt([
    {
      type: 'list',
      name: 'model',
      message: 'Select AI Model:',
      choices: [
        { name: 'OpenAI (Not yet implemented)', value: 'openai' },
        { name: 'Anthropic', value: 'anthropic' },
        { name: 'Back to settings menu', value: 'back' }
      ]
    }
  ]);

  switch (model) {
    case 'openai':
      console.log(chalk.yellow('OpenAI is not yet implemented.'));
      await selectModel();
      break;
    case 'anthropic':
      await setAnthropicModel(config);
      break;
    case 'back':
      await settingsMenu();
      break;
  }
}

// Function to set Anthropic model
async function setAnthropicModel(config) {
  const currentApiKey = config.models[0].anthropic.api_key;
  
  if (currentApiKey) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Anthropic API Key is already set. What would you like to do?',
        choices: [
          { name: 'Update API Key', value: 'update' },
          { name: 'Keep current API Key', value: 'keep' }
        ]
      }
    ]);

    if (action === 'keep') {
      console.log(chalk.green('Keeping current Anthropic API Key.'));
      await selectModel();
      return;
    }
  }

  const { apiKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter Anthropic API Key (or press Enter to cancel):',
      mask: '*'
    }
  ]);

  if (!apiKey) {
    console.log(chalk.yellow('API Key update cancelled.'));
    await selectModel();
    return;
  }

  config.models[0].anthropic.api_key = apiKey;
  config.models[0].anthropic.selected = true;
  writeConfig(config);
  console.log(chalk.green('Anthropic model selected and API key saved.'));
  await selectModel();
}

// Run the CLI
mainMenu().catch(console.error);