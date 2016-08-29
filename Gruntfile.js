module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    wiredep: {
      task: {
        src: ['app/index.html']
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp/{,**/}*',
            '.tmp',
            'public/components/{,**/}*',
            'public/{,**/}*',
            '!public/.git{,**/}*'
          ]
        }]
      },
      server: '.tmp'
    },
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'public',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: 'public/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '{,*/}*.svg',
          dest: 'public/images'
        }]
      }
    },
    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['public/{,*/}*.html'],
      css: ['public/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          'public',
          // 'public/images', bug that doesnt rename reference in html ng-src
          'public/styles'
        ]
      }
    },
    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          'public/scripts/{,*/}*.js',
          'public/styles/{,*/}*.css',
          // 'public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}', bug that doesnt rename reference in html ng-src
          'public/styles/fonts/*'
        ]
      }
    },
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },
    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'app',
            dest: 'public',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'components/{,**/}*.html',
              // 'components/**/*.html',
              // 'components/**/**/*.html',
              // 'components/**/**/**/*.html',
              'images/{,*/}*.{webp}',
              'fonts/*',
            ]
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: 'public/images',
            src: ['generated/*']
          },
          {
            expand: true,
            dot: true,
            cwd: 'app/bower_components/components-font-awesome',
            src: 'fonts/*',
            dest: 'public'
          },
          {
            expand: true,
            dot: true,
            cwd: 'app/bower_components/roboto-fontface',
            src: 'fonts/*',
            dest: 'public'
          }
        ]
      },
      styles: {
        expand: true,
        cwd: 'app/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    cdnify: {
      dist: {
        html: ['public/*.html']
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: false,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: 'public',
          src: ['*.html', 'components/{,**/}*.html'],
          dest: 'public'
        }]
      }
    }
  });


  grunt.registerTask('bower', ['wiredep']);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin',
    'clean:server'
  ]);

};