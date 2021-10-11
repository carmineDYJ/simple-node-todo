#!/usr/bin/env node
const program = require('commander');
const api = require('./index.js');
const pkg = require('./package.json');

program.
  version(pkg.version);

program
  .command('add')
  .description('add a task')
  .action((...args) => {
    const taskWords = args.slice(0, -1);
    const taskName = taskWords.join(' ');
    api.add(taskName).then(()=>{console.log('add task succ')}, ()=>{console.log('add task fail')});
  });

program
  .command('clear')
  .description('clear all tasks')
  .action((...args) => {
    const taskWords = args.slice(0, -1);
    const task = taskWords.join(' ');
    api.clear().then(()=>{console.log('clear task succ')}, ()=>{console.log('clear task fail')});
  });

program.parse(process.argv);

if(process.argv.length === 2) {
  // 用户直接调用node cli
  api.show();
}
