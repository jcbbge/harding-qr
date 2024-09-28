const EventEmitter = require('events');
const readline = require('readline');

class TaskManager extends EventEmitter {
  constructor() {
    super();
    this.tasks = new Map();
  }

  addTask(taskId, description) {
    this.tasks.set(taskId, { id: taskId, description, status: 'pending' });
    this.emit('taskAdded', { taskId, description });
  }

  updateTask(taskId, status) {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = status;
      this.emit('taskUpdated', { taskId, status });
    }
  }

  listTasks() {
    return Array.from(this.tasks.values());
  }
}

const taskManager = new TaskManager();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser() {
  rl.question('Enter command (add/update/list/quit): ', (cmd) => {
    switch(cmd) {
      case 'add':
        rl.question('Task ID: ', (id) => {
          rl.question('Description: ', (desc) => {
            taskManager.addTask(id, desc);
            promptUser();
          });
        });
        break;
      case 'update':
        rl.question('Task ID: ', (id) => {
          rl.question('New status: ', (status) => {
            taskManager.updateTask(id, status);
            promptUser();
          });
        });
        break;
      case 'list':
        console.log(taskManager.listTasks());
        promptUser();
        break;
      case 'quit':
        rl.close();
        break;
      default:
        console.log('Unknown command');
        promptUser();
    }
  });
}

taskManager.on('taskAdded', ({ taskId, description }) => {
  console.log(`Task added: ${taskId} - ${description}`);
});

taskManager.on('taskUpdated', ({ taskId, status }) => {
  console.log(`Task ${taskId} updated to ${status}`);
});

promptUser();
