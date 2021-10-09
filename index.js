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
  // taskList.forEach((task, index)=>{
  //   console.log(`${task.done ? '[o]': '[x]'} Task${index + 1}: ${task.taskName}`);
  // });
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
        inquirer
          .prompt(
            {
              type: 'list',
              name: 'index',
              message: 'Plz choose what u wanna do',
              choices: [
                {name: 'Exit', value: 'exit'},
                {name: 'MarkAsDone', value: 'MarkAsDone'},
                {},
              ]
            })
      } else if (answer.index === -2) {

      }
    });
}