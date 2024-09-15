#!/usr/bin/env node

/**
 * end-session.js
 * Updates tasks and progress after a development session.
 * All dependencies and configurations are self-contained within the ai directory.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Paths
const aiDir = __dirname;
const tasksFilePath = path.join(aiDir, 'data', 'tasks.json');
const sessionDir = path.join(aiDir, 'ai_sessions');
const sessionFile = path.join(sessionDir, 'current_session.md');
const roadmapFile = path.join(aiDir, 'ROADMAP.md');
const tasksMarkdownFile = path.join(aiDir, 'context', 'tasks.md');

// Check if tasks file exists
if (!fs.existsSync(tasksFilePath)) {
  console.error('Tasks file not found. Please run start-session first.');
  process.exit(1);
}

// Load tasks
let tasks = JSON.parse(fs.readFileSync(tasksFilePath, 'utf8'));

// Setup readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function generateTaskList(tasks, indent = '', width = process.stdout.columns || 80) {
  const maxIdLength = Math.max(...tasks.map(task => task.id.length));

  return tasks
    .map(task => {
      const checkboxPart = `${indent}[${task.done ? 'x' : ' '}]  `;
      const descriptionPart = task.description;
      const idPart = task.id.padStart(maxIdLength);

      const availableSpace = width - checkboxPart.length - idPart.length - 2;
      const truncatedDescription =
        descriptionPart.length > availableSpace
          ? descriptionPart.slice(0, availableSpace - 3) + '...'
          : descriptionPart;

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
    console.log(`Task ${taskId} deleted.`);
  } else {
    console.log(`Task ${taskId} not found.`);
  }
}

function addOrEditTask(taskId = null) {
  let currentTask = taskId ? findTask(taskId) : null;
  let parentTask = null;
  let indentLevel = 0;

  if (taskId && !currentTask) {
    console.log(`Task ${taskId} not found. Please try again.`);
    manageTasksInterface();
    return;
  }

  console.log(taskId ? `Editing task ${taskId}:` : 'Adding new tasks:');
  console.log('Use double space to create subtasks. Empty line to finish.');

  function promptTask() {
    rl.question('> '.padStart(indentLevel * 2), input => {
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
          if (taskId && indentLevel === 0) {
            currentTask.description = taskDescription;
          } else {
            currentTask = { description: taskDescription, done: false, subtasks: [] };
            tasks.push(currentTask);
          }
          parentTask = null;
          indentLevel = 0;
        } else if (newIndentLevel === 2) {
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

function displayHelp() {
  console.log('\nHelp Guide:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Main Interface:');
  console.log('  "a" - Add new tasks');
  console.log('  "e #" - Edit a specific task (replace # with task ID)');
  console.log('  "d #" - Delete a specific task (replace # with task ID)');
  console.log('  "t #" - Toggle task completion (replace # with task ID)');
  console.log('  "?" - Display this help guide');
  console.log('  "x" - Finish the session and save changes');
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

function manageTasksInterface() {
  taskCounter = 0;
  assignTaskIds(tasks);
  console.log('\nCurrent Tasks:');
  console.log(generateTaskList(tasks));
  rl.question(
    'Enter command (a:add, e #:edit, d #:delete, t #:toggle, ?:help, x:exit, or press Enter to exit): ',
    answer => {
      const [command, ...args] = answer.trim().split(/\s+/);
      const taskIds = args.join(' ').split(' ');

      switch (command.toLowerCase()) {
        case '':
        case 'x':
          saveAndExit();
          break;
        case 'a':
          addOrEditTask();
          break;
        case '?':
          displayHelp();
          manageTasksInterface();
          break;
        case 'e':
          if (taskIds.length === 1) {
            const task = findTask(taskIds[0]);
            if (task) {
              addOrEditTask(taskIds[0]);
            } else {
              console.log(`Task ${taskIds[0]} not found. Please try again.`);
              manageTasksInterface();
            }
          } else {
            console.log('Please provide a task ID to edit. Example: e 2.1');
            manageTasksInterface();
          }
          break;
        case 'd':
          if (taskIds.length === 1) {
            deleteTask(taskIds[0]);
            manageTasksInterface();
          } else {
            console.log('Please provide a task ID to delete. Example: d 1');
            manageTasksInterface();
          }
          break;
        case 't':
          if (taskIds.length > 0) {
            toggleTaskCompletion(taskIds);
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

function displayTaskStatus() {
  let totalTasks = 0;
  let completedTasks = 0;

  function countTasks(taskList) {
    taskList.forEach(task => {
      totalTasks++;
      if (task.done) completedTasks++;
      if (task.subtasks && task.subtasks.length > 0) {
        countTasks(task.subtasks);
      }
    });
  }

  countTasks(tasks);

  const incompleteTasks = totalTasks - completedTasks;

  console.log('\nTask Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Total Tasks:     ${totalTasks}`);
  console.log(`Completed:       ${completedTasks}`);
  console.log(`Incomplete:      ${incompleteTasks}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const progressBar =
    '█'.repeat(Math.floor(completionPercentage / 5)) +
    '░'.repeat(20 - Math.floor(completionPercentage / 5));

  console.log(`Progress: [${progressBar}] ${completionPercentage.toFixed(1)}%`);
}

function saveAndExit() {
  taskCounter = 0;
  assignTaskIds(tasks);
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  updateTasksMarkdown();
  console.log('Session ended. Tasks updated.');
  displayTaskStatus();
  summarizeSession();
  emptyCurrentSession();
  rl.close();
}

function updateTasksMarkdown() {
  const tasksMarkdown = generateFormattedTaskList(tasks);
  fs.writeFileSync(tasksMarkdownFile, tasksMarkdown);
}

function summarizeSession() {
  if (fs.existsSync(sessionFile)) {
    const sessionContent = fs.readFileSync(sessionFile, 'utf8');
    const summary = generateSummary(sessionContent);
    const taskSummary = generateFormattedTaskList(tasks);

    const timestamp = new Date()
      .toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

    // Append summary to ROADMAP.md
    const roadmapUpdate = `
## Session Summary (${timestamp})
${summary}

## End of Session Updates
Task Overview:
${taskSummary}
 ...
`;
    fs.appendFileSync(roadmapFile, roadmapUpdate);

    // Archive the session with task updates
    const archiveDir = path.join(sessionDir, 'archive');
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }
    const archiveTimestamp = timestamp.replace(/:/g, '-');
    const archiveContent = `${sessionContent}\n\n## End of Session Updates\nTask Overview:\n${taskSummary}\n ... `;
    fs.writeFileSync(path.join(archiveDir, `session_${archiveTimestamp}.md`), archiveContent);

    console.log('Session summarized and archived with end of session updates.');
    console.log('ROADMAP.md updated with end of session information.');
  } else {
    console.warn('No active session found.');
  }
}

function generateSummary(sessionContent) {
  // Simple summary generation - can be enhanced
  const lines = sessionContent.split('\n');
  const summary = lines.slice(0, 5).join('\n'); // First 5 lines as summary
  return summary + '\n...\n';
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

function emptyCurrentSession() {
  fs.writeFileSync(sessionFile, '');
  console.log('Current session file emptied.');
}

manageTasksInterface();
