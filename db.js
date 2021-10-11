// 优先使用HOME环境变量，如果没有使用默认home路径
const home = process.env.HOME || require('os').homedir();
const path = require('path');
const dbPath = path.join(home, '.todo');
const fs = require('fs');

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject)=>{
      fs.readFile(path, {flag: 'a+'}, (error, data) => {
        if (error) {
          return reject(error);
        } else {
          let taskList;
          try {
            taskList = JSON.parse(data);
          } catch (error) {
            taskList = [];
          }
          resolve(taskList);
        }
      });
    })
  },
  write(taskList, path=dbPath){
    return new Promise((resolve, reject)=>{
      const taskListStr = JSON.stringify(taskList);
      fs.writeFile(dbPath, taskListStr + '\n', (error)=>{
        if (error) return reject(error);
        else resolve();
      });
    })
  }
};
module.exports = db;