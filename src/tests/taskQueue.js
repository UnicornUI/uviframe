
// 
function TaskQueue() {
  this.task = [];
  this.data = {};
}


(function() {
  TaskQueue.prototype.appendTask = function(func) {
    if (!func) {
      return;
    }
    this.task.push(func);
  }

  TaskQueue.prototype.preAppendTask = function(task) {
    if (!task) {
      return;
    }
    this.task.unshift(task)
  }

  TaskQueue.prototype.goNext = function() {
    if (!this.task.length) {
      return;
    }
    this.task.shift()(this);
  }

  TaskQueue.prototype.setData = function(key, value) {
    if (!key) {
      return;
    }
    this.data[key] = value;
  }

  TaskQueue.prototype.getData = function(key) {
    return this.data[key];
  }

})()
