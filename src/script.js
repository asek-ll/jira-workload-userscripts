(function ($) {
  var padZero = function (value, numCount) {
    var stringValue = value.toString();
    var count = numCount - stringValue.length;
    return (new Array(count + 1)).join('0') + stringValue;
  };

  var formatInterval = function (interval, format) {
    return format.replace(new RegExp('%h|%m|%s|%d|%i', 'g'), function (type) {
      switch (type) {
        case '%h':
          return Math.floor(interval / 1000 / 3600) % 60;
        case '%s':
          return padZero(Math.floor(interval / 1000) % 60, 2);
        case '%i':
          return padZero(Math.floor(interval / 1000 / 60) % 60, 2);
        case '%d':
          return Math.floor(interval / 1000 / 3600 / 8);
      }
    });
  };

  var formatDate = function (date, format) {
    return format.replace(new RegExp('%h|%m|%s|%d|%i|%y', 'g'), function (type) {
      switch (type) {
        case '%h':
          return padZero(date.getHours(), 2);
        case '%s':
          return padZero(date.getSeconds(), 2);
        case '%i':
          return padZero(date.getMinutes(), 2);
        case '%d':
          return date.getDate();
        case '%m':
          return padZero(date.getMonth() + 1, 2);
        case '%y':
          return date.getUTCFullYear();
      }
    });
  };

  var IssueStatus = function (key) {
    var defaults = {
      running: false,
      startTime: null,
      totalWorkload: 0
    };

    var data = {};

    var load = function () {
      data = null;
      var json = localStorage.getItem(key);
      try {
        data = $.parseJSON(json);
      } catch (e) { }

      if (!data) {
        data = $.extend({}, defaults);
      }

      data.startTime = new Date(data.startTime);
    };

    load();

    var write = function () {
      localStorage.setItem(key, JSON.stringify(data));
    };

    var start = function () {
      if (!data.running) {
        data.running = true;
        data.startTime = new Date();
        write();
      }
    };

    var stop = function () {
      if (data.running) {
        data.running = false;
        data.totalWorkload += ((new Date()) - data.startTime);
        write();
      }
    };

    var clear = function () {
      data.totalWorkload = 0;
      data.running = false;
      localStorage.removeItem(key);
    };

    var isRunning = function () {
      return data.running;
    };

    var getData = function () {
      return data;
    };

    return $.extend(this, {
      start: start,
      stop: stop,
      clear: clear,
      isRunning: isRunning,
      getData: getData
    });
  };

  var getInfo = function (issueStatus) {
    var data = issueStatus.getData();
    var output = '';
    var workload = data.totalWorkload;

    if (issueStatus.isRunning()) {
      output += 'Start: ' + formatDate(data.startTime, '%d.%m.%y %h:%i') + '<br />';
      workload += (new Date()) - data.startTime;
    }
    return output + 'Workload: ' + formatInterval(workload, '%d d, %h:%i:%s');
  };

  var issueKey = /[^\/]+$/g.exec(document.URL);
  var issueStatus = new IssueStatus(issueKey);

  var $startBtn = $('<button>Start</button>').click(function () {
    console.log('try to start');
    issueStatus.start();
    checkButtons();
  });
  var $stopBtn = $('<button>Stop</button>').click(function () {
    console.log('try to stop');
    issueStatus.stop();
    checkButtons();
  });
  var $clearBtn = $('<button>Clear</button>').click(function () {
    if (confirm('Are you sure?')) {
      issueStatus.clear();
      checkButtons();
    }
  });

  var $widget = $('<tr id="workloadHelper"><td class="lazyOperation"> <span class="info"></span> <div class="buttons"></div> </td></tr>');
  $('#available_workflow_actions').append($widget);
  $widget.find('.buttons').append($startBtn, $stopBtn, $clearBtn);

  var checkButtons = function () {
    if (issueStatus.isRunning()) {
      $stopBtn.show();
      $startBtn.hide();
    } else {
      $stopBtn.hide();
      $startBtn.show();
    }
  };
  checkButtons();

  var updateInfo = function () {
    var info = getInfo(issueStatus);
    $widget.find('.info').html(info);
  };

  setInterval(updateInfo, 1000);

})(jQuery);
