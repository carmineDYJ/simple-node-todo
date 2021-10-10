const db = require('./db.js');
const inquirer = require('inquirer');

module.exports.add = async (taskName)=>{
  // 读取之前的任务
  const taskList = await db.read();

  // 添加一个任务
  taskList.push({taskName, done:false});

  // 添加任务到文件
  await db.write(taskList);
}

module.exports.clear = async ()=>{
  await db.write([]);
}

module.exports.show = async ()=>{
  const taskList = await db.read();
  inquirer
    .prompt(
      {
        type: 'list',
        name: 'index',
        message: 'Plz choose the task u wanna focus',
        choices: [{name: 'Exit', value: '-1'}, ...taskList.map((task, index)=>{
          return {name: `${task.done ? '[o]': '[x]'} Task${index + 1}: ${task.taskName}`, value: index.toString()};
        }), {name: 'Add Task', value: '-2'}],
      },
    )
    .then((answer) => {
      if (answer.index >= 0) {
        const index = parseInt(answer.index);
        console.log(taskList[index]);
        inquirer
          .prompt(
            {
              type: 'list',
              name: 'index',
              message: 'Plz choose what u wanna do',
              choices: [
                {name: 'Exit', value: 'exit'},
                {name: 'MarkAsDone', value: 'MarkAsDone'},
                {name: 'MarkAsUndone', value: 'MarkAsUndone'},
                {name: 'Delete', value: 'Delete'},
                {name: 'Update', value: 'Update'},
              ]
            }).then(answer2 => {
              switch (answer2.action){
                case 'MarkAsDone':
                  taskList[index].done = true;
                  console.log(taskList[index]);
                  db.write(taskList);
                  break;
                case 'MarkAsUndone':
                  taskList[index].done = false;
                  db.write(taskList);
                  break;
                case 'Update':
                  inquirer.prompt({
                    type: 'input',
                    name: 'newName',
                    message: 'Plz input new name',
                    default: taskList[index].taskName
                  }).then(answer3 => {
                    taskList[index].taskName = answer3.newName;
                    db.write(taskList);
                  });
                  break;
                case 'Delete':
                  taskList.splice(index, 1);
                  db.write(taskList);
                  break;
              }
        })
      } else if (answer.index === -2) {
        inquirer.prompt({
          type: 'input',
          name: 'taskName',
          message: 'Plz input new task',
        }).then(answer4 => {
          taskList.push({taskName: answer4.taskName, done:false});
          db.write(taskList);
        });
      }
    });
}