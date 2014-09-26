module.exports = function(grunt) {

  // Project configuration.
  var urls = {
    'http://jira.transas.com/browse/': 'script.js',
    'http://jira.transas.com/secure/CommentAssignIssue!default.jspa': 'test.js'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ['dist']
    },
    ejs: {
      source: {
        options: {
          urls: urls
        },
        src: 'templates/sources.ejs',
        dest: 'dist/sources.ejs',
      },
      all: {
        options: {
          name: 'JiraWorkLog',
          description: 'Jira worklog helpers',
          author: 'denblo',
          urls: urls
        },
        src: 'templates/userscript.ejs',
        dest: 'dist/jira.user.js',
      }
    }
    });

  grunt.loadNpmTasks('grunt-ejs');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('default', ['clean:dist','ejs:source', 'ejs:all']);
  grunt.registerTask('source', ['clean:dist','ejs:source']);

};
