const db = require('../db.js');

const fs = require('fs');
jest.mock('fs');

describe('db', ()=>{
  it('should read', async ()=>{
    expect(db.read instanceof Function).toBe(true);
    const data = [{"done": true,"taskName": "test-task-1"}];
    fs.setMock('/xxx', null, JSON.stringify(data));
    const taskList = await db.read('/xxx');
    expect(taskList).toStrictEqual(data);
  });
})