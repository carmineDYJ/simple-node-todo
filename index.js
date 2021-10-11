const db = require('./db.js');
const inquirer = require('inquirer');

module.exports.add = async (taskName) => {
  // 读取之前的任务
  const taskList = await db.read();

  // 添加一个任务
  taskList.push({taskName, done: false});

  // 添加任务到文件
  await db.write(taskList);
};

module.exports.clear = async () => {
  await db.write([]);
};

function markAsDone(taskList, index) {
  taskList[index].done = true;
  db.write(taskList);
}

function markAsUndone(taskList, index) {
  taskList[index].done = false;
  db.write(taskList);
}

function updateTask(taskList, index) {
  inquirer.prompt({
    type: 'input',
    name: 'newName',
    message: 'Plz input new name',
    default: taskList[index].taskName
  }).then(answer3 => {
    taskList[index].taskName = answer3.newName;
    db.write(taskList);
  });
}

function deleteTask(taskList, index) {
  taskList.splice(index, 1);
  db.write(taskList);
}

function askForAction(taskList, index) {
  const actions = {
    markAsDone, markAsUndone, updateTask, deleteTask
  };
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'action',
        message: 'Plz choose what u wanna do',
        choices: [
          {name: 'Exit', value: 'exit'},
          {name: 'MarkAsDone', value: 'markAsDone'},
          {name: 'MarkAsUndone', value: 'markAsUndone'},
          {name: 'DeleteTask', value: 'deleteTask'},
          {name: 'UpdateTask', value: 'updateTask'},
        ]
      }).then(answer2 => {
    const action = actions[answer2.action];
    action && action(taskList, index);
  });
}

function askForCreateTask(taskList) {
  inquirer.prompt({
    type: 'input',
    name: 'taskName',
    message: 'Plz input new task',
  }).then(answer4 => {
    taskList.push({taskName: answer4.taskName, done: false});
    db.write(taskList);
  });
}

function printTasks(taskList) {
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'index',
        message: 'Plz choose the task u wanna focus',
        choices: [{name: 'Exit', value: '-1'}, ...taskList.map((task, index) => {
          return {name: `${task.done ? '[o]' : '[x]'} Task${index + 1}: ${task.taskName}`, value: index.toString()};
        }), {name: 'Add Task', value: '-2'}],
      },
    )
    .then((answer) => {
      const index = parseInt(answer.index);
      if (index >= 0) {
        askForAction(taskList, index);
      } else if (index === -2) {
        askForCreateTask(taskList);
      }
    });
}

module.exports.show = async () => {
  const taskList = await db.read();

  printTasks(taskList);
};