var Ajax = {};

(function() {
  Ajax.get = function(option) {
    option = option || {}

    if (!option.url) {
      return;
    }
    option.msg && console.log(option.msg);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', option.url, true);
    xhr.onreadystatechange = function() {
      if (4 != xhr.readyState) {
        return;
      }
      if (200 == xhr.status) {
        setTimeout(() => {
          option.callback && option.callback(xhr.responseText);
        }, 2000)
      }
    }
    xhr.send(null);
  }

  Ajax.getTask = function(taskQueue, option) {
    option = option || {}

    if (!option.url) {
      return;
    }
    option.msg && console.log(option.msg);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', option.url, true);
    xhr.onreadystatechange = function() {
      if (4 != xhr.readyState) {
        return;
      }
      if (200 == xhr.status) {
        setTimeout(() => {
          taskQueue.setData('data', xhr.responseText);
          taskQueue.goNext();
          // option.callback && option.callback(xhr.responseText);
        }, 2000)
      }
    }
    xhr.send(null);
  }
  
})()
