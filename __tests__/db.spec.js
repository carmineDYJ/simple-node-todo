const db = require('../db.js');

const fs = require('fs');
jest.mock('fs');

describe('db', ()=>{
  afterEach(()=>{
    fs.clearMocks();
  })
  it('should read', async ()=>{
    expect(db.read instanceof Function).toBe(true);
    const data = [{"taskName": "test-task-1", "done": true}];
    fs.setReadMock('/xxx', null, JSON.stringify(data));
    const taskList = await db.read('/xxx');
    expect(taskList).toStrictEqual(data);
  });
  it('should write', async ()=>{
    let fakeFile = "";
    expect(db.write instanceof Function).toBe(true);
    fs.setWriteMock('/yyy', (path, data, callback)=>{
      fakeFile = data;
      callback(null);
    });
    const taskList = [{"taskName": "test-task-1", "done": true}];
    await db.write(taskList, '/yyy');
    expect(fakeFile).toBe(JSON.stringify(taskList) + '\n');
  });
})