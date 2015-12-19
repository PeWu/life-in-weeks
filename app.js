var app = angular.module('lifeInWeeks', []);


/**
 * Page controller.
 */
MainCtrl = function($scope) {
  /** Page title */
  this.title = 'My life in weeks';
  /** Date of birth */
  this.birthDate = new Date('1970-01-01');
  /** Number of years to display */
  this.totalYears = 90;
  /** Whether to show the legend */
  this.showLegend = true;
  /** Input data in JSON format */
  this.dataInput = '';

  /** Generated data */
  this.years = [];
  /** Generated legend */
  this.legend = [];

  /** Week numbers: 1 and multiples of 5 */
  this.weekNumbers = [];
  for (var i = 1; i < 52; ++i) {
    if (i == 1 || i % 5 == 0) {
      this.weekNumbers.push(i);
    } else {
      this.weekNumbers.push(undefined);
    }
  }

  var exampleData = {
    spans: [{
      color: '#ddd'
    }, {
      begin: "2010-01-01",
      end: "2012-06-20",
      color: "yellow",
      description: "Good times"
    }, {
      begin: '2013-03-21',
      color: '#f8a',
      description: 'Recent times'
    }]
  };
  /** Example data in JSON format */
  this.exampleData = JSON.stringify(exampleData, null, 2);

  // Register watchers to update view on changes.
  $scope.$watch('ctrl.birthDate', this.update.bind(this));
  $scope.$watch('ctrl.totalYears', this.update.bind(this));
  $scope.$watch('ctrl.dataInput', this.update.bind(this));

  this.update();
};


MainCtrl.prototype.update = function() {
  // Parse input.
  if (!this.dataInput) {
    this.data = {};
  } else {
    try {
      this.data = JSON.parse(this.dataInput);
    } catch (err) {
      this.jsonError = err.message;
      return;
    }
  }
  this.jsonError = undefined;
  
  // Parse dates.
  if (this.data.spans) {
    this.data.spans.forEach(function(span) {
      if (span.begin) {
        span.begin = new Date(span.begin);
      }
      if (span.end) {
        span.end = new Date(span.end);
      }
    });
  }
  
  // Generate legend.
  this.legend = [];
  if (this.data.spans) {
    this.data.spans.forEach(function(span) {
      if (span.description && span.color) {
        this.legend.push({
          description: span.description,
          style: 'background: ' + span.color + '!important'
        });
      }
    }.bind(this));
  }

  // Generate data for table.
  this.years = [];
  var currentYear = 0;
  var currentDate = new Date(this.birthDate);
  var nextBirthday = new Date(this.birthDate);
  nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  var year = {weeks: [], number: 0};
  var today = new Date();
  while (currentYear < this.totalYears) {
    var nextDate = new Date(currentDate);
    // Add 7 days.
    nextDate.setDate(nextDate.getDate() + 7);
    if (nextDate > nextBirthday) {
      this.years.push(year);
      currentYear++;
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
      var yearNum = undefined;
      if (currentYear % 5 == 0) {
        yearNum = currentYear;
      }
      year = {weeks: [], number: yearNum};
    }
    var color = undefined;
    if (this.data.spans) {
      this.data.spans.forEach(function(span) {
        if ((!span.begin || nextDate >= span.begin) && ((!span.end && currentDate < today) || currentDate < span.end)) {
          color = 'background: ' + span.color + '!important';
        }
      });
    }
    var week = {
      date: new Date(currentDate),
      style: color
    };
    year.weeks.push(week);

    currentDate = nextDate;
  }
};


/** Displays the default browser print window. */
MainCtrl.prototype.print = function() {
  window.print();
};


app.controller('MainCtrl', MainCtrl);
