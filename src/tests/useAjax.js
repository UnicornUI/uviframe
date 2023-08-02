(function() {
  /*
   // 嵌套调用的回调地狱
  Ajax.get({
    url: "data.json",
    msg: "第一次调用",
    callback: function(data) {
      console.log("第一次调用获取到的数据", data);
      Ajax.get({
        url: "data.json",
        msg: "第二次调用",
        callback: function(data) {
          console.log("第二次调用获取到数据", data);
          Ajax.get({
            url: "data.json",
            msg: "第三次体调用",
            callback: function(data) {
              console.log("第三次调用获取到的数据", data);
            }
          });
        }
      });
    }
  });
  */

  // 任务队列的方式来解决回调地狱的问题
  // 添加任务是当主线程执行的，添加完成后触发任务的执行,
  // 由于我们在每个请求结果处理的时候触发了后续任务，
  // 所以任务可以按照任务的添加顺序执行。

  var taskQueue = new TaskQueue();
  taskQueue.appendTask(function(){
    Ajax.getTask(taskQueue, {
      url: "data.json",
      msg: "第一次调用",
    });
  });
  // 
  taskQueue.appendTask(function() {
    console.log("第一次调用的结果：", taskQueue.getData("data"));
    Ajax.getTask(taskQueue, {
      url: "data.json",
      msg: "第二次调用"
    });
  })

  // 
  taskQueue.appendTask(function() {
    console.log("第二次调用结果: ", taskQueue.getData("data"));
    Ajax.getTask(taskQueue, {
      url: "data.json",
      msg: "第三次调用",
    });
  })

  taskQueue.appendTask(function() {
    console.log("第三次调用的结果", taskQueue.getData("data"));
  })

  taskQueue.goNext();
})()
