(function ($) {
  var padZero = function (value, numCount) {
    var stringValue = value.toString();
    var count = numCount - stringValue.length;
    return (new Array(count + 1)).join('0') + stringValue;
  };

  var formatJiraInterval = function (interval) {
    var result = [];
    var days = Math.floor(interval / 1000 / 3600 / 8);
    if (days > 0) {
      result.push(days.toString() + 'd');
    }

    var hours = Math.floor(interval / 1000 / 3600) % 60;
    if (hours > 0) {
      result.push(hours.toString() + 'h');
    }

    var minutes = Math.floor(interval / 1000 / 60) % 60;
    if (minutes > 0) {
      result.push(minutes.toString() + 'm');
    }

    return result.join(' ');
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

    var getCurrentWorkload = function () {
      var workload = data.totalWorkload;
      if (isRunning()) {
        workload += (new Date()) - data.startTime;
      }
      return workload;
    };

    return $.extend(this, {
      getCurrentWorkload: getCurrentWorkload,
      start: start,
      stop: stop,
      clear: clear,
      isRunning: isRunning,
      getData: getData
    });
  };

  var issueKey = $('#issuedetails tr:eq(0) td:eq(1) a').text();
  var issueStatus = new IssueStatus(issueKey);

  var $input = $('#timeSpenttimetracking');
  $input.val(formatJiraInterval(issueStatus.getCurrentWorkload()));

  $('input[type="submit"]').click(function () {
    issueStatus.clear();
  });

})(jQuery);
