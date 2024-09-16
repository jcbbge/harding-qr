#!/usr/bin/env node

/**
 * start-session.js
 * Generates context files for the AI assistant.
 * All dependencies and configurations are self-contained within the ai directory.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Existing paths
const aiDir = __dirname;
const projectRoot = path.resolve(aiDir, '../');
const outputDir = path.join(aiDir, 'context');
const configFilePath = path.join(aiDir, 'ai-config.json');
const tasksFilePath = path.join(aiDir, 'data', 'tasks.json');

// New session management paths
const sessionDir = path.join(aiDir, 'ai_sessions');
const sessionFile = path.relative(projectRoot, path.join(sessionDir, 'current_session.md'));

// Ensure all necessary directories exist
[outputDir, path.join(aiDir, 'data'), sessionDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Load or create project configurations
let projectConfig = {
  techStack: '',
  codebaseInstructions: ''
};

if (fs.existsSync(configFilePath)) {
  // Load existing configuration
  projectConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
} else {
  // Create default configuration
  projectConfig.techStack = 'Specify your tech stack here.';
  projectConfig.codebaseInstructions = 'Specify your codebase instructions here.';
  fs.writeFileSync(configFilePath, JSON.stringify(projectConfig, null, 2));
  console.log('Created default ai-config.json. Please update it with your project details.');
}

// Create a single readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for tasks
function promptForTasks(existingTasks = []) {
  return new Promise(resolve => {
    const updatedTasks = JSON.parse(JSON.stringify(existingTasks)); // Deep copy
    let currentTasks = updatedTasks;
    let taskPath = [];
    let previousIndent = 0;

    function askForTask(indent = '') {
      rl.question(indent + '> ', input => {
        if (input.trim() === '') {
          if (indent === '') {
            resolve(updatedTasks);
          } else {
            taskPath.pop();
            currentTasks = getTasksAtPath(updatedTasks, taskPath);
            askForTask(indent.slice(2));
          }
        } else {
          const task = { description: input.trim(), done: false, subtasks: [] };
          const indentLevel = input.search(/\S|$/);

          if (indentLevel > previousIndent) {
            // Creating a subtask
            if (currentTasks.length === 0) {
              currentTasks = updatedTasks;
            } else {
              currentTasks = currentTasks[currentTasks.length - 1].subtasks;
              taskPath.push(currentTasks.length - 1);
            }
          } else if (indentLevel < previousIndent) {
            // Going back up the task hierarchy
            const levelsUp = (previousIndent - indentLevel) / 2;
            for (let i = 0; i < levelsUp; i++) {
              taskPath.pop();
            }
            currentTasks = getTasksAtPath(updatedTasks, taskPath);
          }

          currentTasks.push(task);
          previousIndent = indentLevel;
          askForTask(input.slice(0, indentLevel));
        }
      });
    }

    askForTask();
  });
}

function getTasksAtPath(tasks, path) {
  let currentTasks = tasks;
  for (const index of path) {
    currentTasks = currentTasks[index].subtasks;
  }
  return currentTasks;
}

// Load or create tasks
let tasks = [];

if (fs.existsSync(tasksFilePath)) {
  try {
    const tasksData = fs.readFileSync(tasksFilePath, 'utf8');
    if (tasksData.trim() !== '') {
      tasks = JSON.parse(tasksData);
    }
  } catch (error) {
    console.error('Error reading or parsing tasks file:', error);
  }
}

let taskCounter = 0;

function assignTaskIds(taskList, parentId = '') {
  taskList.forEach((task, index) => {
    taskCounter++;
    task.id = parentId ? `${parentId}.${index + 1}` : `${index + 1}`;
    if (task.subtasks && task.subtasks.length > 0) {
      assignTaskIds(task.subtasks, task.id);
    }
  });
}

function addTasks() {
  return promptForTasks(tasks).then(updatedTasks => {
    if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
      tasks = updatedTasks;
      taskCounter = 0; // Reset the counter before reassigning IDs
      assignTaskIds(tasks); // Reassign IDs to all tasks
      fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
      console.log('Tasks have been updated and saved.');
      return true;
    }
    return false;
  });
}

function displayRoadmap() {
  console.log('\nCurrent Roadmap:');
  taskCounter = 0; // Reset the counter before displaying
  assignTaskIds(tasks); // Reassign IDs to all tasks
  console.log(generateTaskList(tasks));
}

function generateTaskList(tasks, indent = '', width = process.stdout.columns || 80) {
  const maxIdLength = Math.max(...tasks.map(task => task.id.length));

  return tasks
    .map(task => {
      const checkboxPart = `${indent}[${task.done ? 'x' : ' '}]  `;
      const descriptionPart = task.description;
      const idPart = task.id.padStart(maxIdLength);

      // Calculate the available space for the description
      const availableSpace = width - checkboxPart.length - idPart.length - 2; // 2 for spacing

      // Truncate the description if it's too long
      const truncatedDescription =
        descriptionPart.length > availableSpace
          ? descriptionPart.slice(0, availableSpace - 3) + '...'
          : descriptionPart;

      // Create the task string with right-aligned ID
      let taskString = `${checkboxPart}${truncatedDescription.padEnd(availableSpace)} ${idPart}\n`;

      if (task.subtasks && task.subtasks.length > 0) {
        taskString += generateTaskList(task.subtasks, indent + '  ', width);
      }
      return taskString;
    })
    .join('');
}

function findTask(taskId, taskList = tasks) {
  for (let task of taskList) {
    if (task.id === taskId) {
      return task;
    }
    if (task.subtasks && task.subtasks.length > 0) {
      const found = findTask(taskId, task.subtasks);
      if (found) return found;
    }
  }
  return null;
}

function editTask(taskId) {
  const task = findTask(taskId);
  if (!task) {
    console.log('Invalid task ID. Please try again.');
    manageTasksInterface();
    return;
  }

  let currentTask = task;
  let indentLevel = 0;

  function editTaskDescription() {
    rl.question('> '.padStart(indentLevel * 2 + 2), input => {
      if (input.trim() === '') {
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
        manageTasksInterface();
        return;
      }

      const newIndentLevel = input.search(/\S|$/);

      if (newIndentLevel > indentLevel) {
        if (!currentTask.subtasks) currentTask.subtasks = [];
        const newSubtask = { description: input.trim(), done: false, subtasks: [] };
        currentTask.subtasks.push(newSubtask);
        currentTask = newSubtask;
        indentLevel = newIndentLevel / 2;
      } else if (newIndentLevel < indentLevel) {
        const levelsUp = indentLevel - newIndentLevel / 2;
        for (let i = 0; i < levelsUp; i++) {
          currentTask = findParentTask(tasks, currentTask);
        }
        currentTask.description = input.trim();
        indentLevel = newIndentLevel / 2;
      } else {
        currentTask.description = input.trim();
      }

      editTaskDescription();
    });
  }

  editTaskDescription();
}

function findParentTask(taskList, childTask) {
  if (!Array.isArray(taskList)) {
    return null;
  }
  for (let task of taskList) {
    if (task.subtasks && task.subtasks.includes(childTask)) {
      return task;
    }
    if (task.subtasks) {
      const parent = findParentTask(task.subtasks, childTask);
      if (parent) return parent;
    }
  }
  return null;
}

function deleteTask(taskId) {
  function removeTask(taskList, id) {
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].id === id) {
        taskList.splice(i, 1);
        return true;
      }
      if (taskList[i].subtasks && taskList[i].subtasks.length > 0) {
        if (removeTask(taskList[i].subtasks, id)) {
          if (taskList[i].subtasks.length === 0) {
            delete taskList[i].subtasks;
          }
          return true;
        }
      }
    }
    return false;
  }

  if (removeTask(tasks, taskId)) {
    taskCounter = 0;
    assignTaskIds(tasks);
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    console.log(`Task ${taskId} deleted.`);
  } else {
    console.log(`Task ${taskId} not found.`);
  }
  manageTasksInterface();
}

function deleteAllTasks() {
  rl.question('Are you sure you want to delete all tasks? (y/n): ', answer => {
    if (answer.toLowerCase() === 'y') {
      tasks = [];
      fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
      console.log('All tasks have been deleted.');
    } else {
      console.log('Task deletion cancelled.');
    }
    manageTasksInterface();
  });
}

function displayHelp() {
  console.log('\nHelp Guide:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Main Interface:');
  console.log('  "a" - Add new tasks');
  console.log('  "e #" - Edit a specific task (replace # with task ID)');
  console.log('  "d #" - Delete a specific task (replace # with task ID)');
  console.log('  "t #" - Toggle status of a specific task (replace # with task ID)');
  console.log('  "d all" - Delete all tasks');
  console.log('  "?" - Display this help guide');
  console.log('  "s #" - Select task and finish the session (replace # with task ID)');
  console.log('\nAdding/Editing Tasks:');
  console.log('  • Main tasks start at the beginning of the line');
  console.log('  • Subtasks are created by adding two spaces before the task description');
  console.log('  • To go back a level, use an empty line');
  console.log('  • To finish editing, use two empty lines');
  console.log('\nTask Format:');
  console.log('  #. [ ] Task description');
  console.log('    #.#. [ ] Subtask description');
  console.log('\nNote: [ ] indicates an incomplete task, [x] indicates a completed task');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

function toggleTaskCompletion(taskIds) {
  taskIds.forEach(taskId => {
    const task = findTask(taskId);
    if (task) {
      task.done = !task.done;
      console.log(`Task ${taskId} ${task.done ? 'marked as complete' : 'marked as incomplete'}.`);
    } else {
      console.log(`Task ${taskId} not found.`);
    }
  });
}

function manageTasksInterface() {
  displayRoadmap();
  rl.question(
    'Enter command (a:add, e #:edit, d #:delete, t #:toggle status, d all:delete all, s #:select task, ?:help): ',
    answer => {
      const [command, ...args] = answer.trim().split(/\s+/);
      const taskId = args.join('.');

      switch (command.toLowerCase()) {
        case 's':
          if (taskId) {
            selectTaskAndFinishSession(taskId);
          } else {
            console.log('Please provide a task ID to select. Example: s 2.1');
            manageTasksInterface();
          }
          break;
        case 'a':
          addOrEditTask();
          break;
        case '?':
          displayHelp();
          manageTasksInterface();
          break;
        case 'e':
          if (taskId) {
            addOrEditTask(taskId);
          } else {
            console.log('Please provide a task ID to edit. Example: e 2.1');
            manageTasksInterface();
          }
          break;
        case 'd':
          if (taskId === 'all') {
            deleteAllTasks();
          } else if (taskId) {
            deleteTask(taskId);
          } else {
            console.log(
              'Please provide a task ID to delete or use "d all" to delete all tasks. Example: d 1'
            );
            manageTasksInterface();
          }
          break;
        case 't':
          if (args.length > 0) {
            toggleTaskCompletion(args);
            manageTasksInterface();
          } else {
            console.log('Please provide at least one task ID to toggle. Example: t 1 1.1 2');
            manageTasksInterface();
          }
          break;
        default:
          console.log('Invalid command. Type "?" for help.');
          manageTasksInterface();
      }
    }
  );
}

function selectTaskAndFinishSession(taskId) {
  const selectedTask = findTask(taskId);
  if (selectedTask) {
    generateContextFiles();
    updateSession(selectedTask);
    console.log(`\nSelected task: ${selectedTask.description}`);
    rl.close();
  } else {
    console.log(`Task ${taskId} not found. Please try again.`);
    manageTasksInterface();
  }
}

function addOrEditTask(taskId = null) {
  let currentTask = taskId ? findTask(taskId) : null;
  let parentTask = null;
  let indentLevel = 0;

  function promptTask() {
    rl.question('> ', input => {
      if (input.trim() === '') {
        if (indentLevel === 0) {
          taskCounter = 0;
          assignTaskIds(tasks);
          fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
          console.log('Tasks updated.');
          manageTasksInterface();
          return;
        } else {
          indentLevel = Math.max(0, indentLevel - 1);
          parentTask = findParentTask(tasks, currentTask);
          currentTask = parentTask || currentTask;
        }
      } else {
        const newIndentLevel = input.search(/\S|$/);
        const taskDescription = input.trim();

        if (newIndentLevel === 0) {
          // Main task
          if (taskId && indentLevel === 0) {
            // Editing existing main task
            currentTask.description = taskDescription;
          } else {
            // Adding new main task
            currentTask = { description: taskDescription, done: false, subtasks: [] };
            tasks.push(currentTask);
          }
          parentTask = null;
          indentLevel = 0;
        } else if (newIndentLevel === 2) {
          // Subtask
          if (!parentTask) {
            parentTask = currentTask || tasks[tasks.length - 1];
          }
          if (!parentTask.subtasks) {
            parentTask.subtasks = [];
          }
          const newSubtask = { description: taskDescription, done: false, subtasks: [] };
          parentTask.subtasks.push(newSubtask);
          currentTask = newSubtask;
          indentLevel = 1;
        } else {
          console.log(
            'Invalid indentation. Use no spaces for main tasks or two spaces for subtasks.'
          );
          promptTask();
          return;
        }
      }
      promptTask();
    });
  }

  promptTask();
}

function generateTaskOverview(taskList, indent = '') {
  return taskList
    .map(task => {
      let overview = `\n${indent}- ${task.done ? '[x]' : '[ ]'} ${task.description}`;
      if (task.subtasks && task.subtasks.length > 0) {
        overview += generateTaskOverview(task.subtasks, indent + '  ');
      }
      return overview;
    })
    .join('');
}

function generateSelectedTaskOverview(task, indent = '') {
  let overview = `${indent}- ${task.done ? '[x]' : '[ ]'} ${task.description}`;
  if (task.subtasks && task.subtasks.length > 0) {
    overview +=
      '\n' +
      task.subtasks.map(subtask => generateSelectedTaskOverview(subtask, indent + '  ')).join('\n');
  }
  return overview;
}

function generateContextFiles() {
  const updatedFiles = [];

  function writeFile(filePath, content) {
    const relativePath = path.relative(projectRoot, filePath);
    fs.writeFileSync(filePath, content);
    updatedFiles.push(relativePath);
  }

  writeFile(
    path.join(outputDir, 'project_structure.md'),
    `# Project Structure\n\n${generateProjectStructure(projectRoot)}`
  );

  writeFile(
    path.join(outputDir, 'codebase_instructions.md'),
    `${projectConfig.codebaseInstructions}`
  );

  writeFile(path.join(outputDir, 'tech_stack.md'), `# Tech Stack\n\n${projectConfig.techStack}`);

  writeFile(
    path.join(outputDir, 'tasks.md'),
    `# Current Tasks\n\n${generateFormattedTaskList(tasks)}`
  );

  updateSession();

  console.log('\nUpdated files:');
  updatedFiles.forEach(file => console.log(file));
}

function generateProjectStructure(dir, relativePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let structure = '';

  entries.forEach(entry => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'ai') return; // Ignore hidden files and specific directories
    const fullPath = path.join(dir, entry.name);
    const entryPath = path.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      structure += `- 📁 ${entryPath}/\n`;
      structure += generateProjectStructure(fullPath, entryPath);
    } else {
      structure += `  - 📄 ${entryPath}\n`;
    }
  });

  return structure;
}

function generateFormattedTaskList(taskList, indent = '') {
  return taskList
    .map(task => {
      let taskString = `${indent}- ${task.done ? '[x]' : '[ ]'} ${task.description}`;
      if (task.subtasks && task.subtasks.length > 0) {
        taskString += '\n' + generateFormattedTaskList(task.subtasks, indent + '  ');
      }
      return taskString;
    })
    .join('\n');
}

function updateSession(selectedTask) {
  const timestamp = new Date()
    .toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

  const taskOverview = generateTaskOverview(tasks);
  let sessionContent = `## Session Started (${timestamp})\nTask Overview:${taskOverview}\n`;

  if (selectedTask) {
    sessionContent += `\nCurrent Selected Task:\n${generateSelectedTaskOverview(selectedTask)}\n`;
  }

  sessionContent += ' ... ';
  fs.writeFileSync(sessionFile, sessionContent);
  console.log(`Session started at ${timestamp}`);
}

// Modify the runScript function to initialize the session
function runScript() {
  if (tasks.length === 0) {
    console.log("No tasks found. Let's add some tasks.");
    addTasks().then(() => {
      manageTasksInterface();
    });
  } else {
    taskCounter = 0;
    assignTaskIds(tasks);
    manageTasksInterface();
  }
}

runScript();
