var generators = require('yeoman-generator');
var Base = generators.Base;
var path = require('path');
var bowerDependencies;

module.exports = Base.extend({

    initNpmConfig: function () {

        var config = {
            "name": this.appname,
            "version": "1.0.0",
            "description": "",
            "main": "server/main.js",
            "scripts": {
                "start": "NODE_PATH=./server nodemon server/main.js --exec babel-node --presets es2015",
                "test": ""
            },
            "author": "",
            "license": "ISC",
            "dependencies": {
            },
            "devDependencies": {
            }
        };
        this.fs.writeJSON('package.json', config);
    },

    initBowerConfig: function () {

        var config = {
            "name": this.appname,
            "description": "",
            "main": "",
            "authors": "",
            "license": "ISC",
            "moduleType": [],
            "homepage": "",
            "ignore": [
                "**/.*",
                "node_modules",
                "bower_components",
                "test",
                "tests"
            ],
            "dependencies": {
            }
        };
        this.fs.writeJSON('bower.json', config);
    },

    constructor: function () {

        Base.apply(this, arguments);
        this.argument('p', {type: String, required: false});
    },

    prompting: function () {

        var cb = this.async();
        this.prompt({
            type: "checkbox",
            name: 'bowerDependencies',
            message: 'What do you want?',
            choices: ['foundation-sites#6.2.0', 'susy#2.2.12', 'angular#1.3.15',
                'EaselJS#0.8.2', 'PreloadJS#0.6.2', 'SoundJS#0.6.2', 'TweenJS#0.6.2',
                'gsap#1.18.2', 'moment#2.11.0', 'owlcarousel#1.3.2'],
            default: ['foundation-sites#6.2.0', 'susy#2.2.12']
        }, function (a) {
            bowerDependencies = a.bowerDependencies;
            cb();
        }.bind(this));
    },

    writing: function () {

        var cb = this.async();
        var p = this.p;
        if (p && !('c' === p || 'f' === p)) {
            return;
        } else if (!p || 'f' === p) {
            this.fs.copy(path.join(__dirname, 'templates'), '.');
            this.spawnCommandSync('mkdir', ['logs', 'client', 'client/htmls', 'client/images', 'client/js', 'client/maps',
                'client/scripts', 'client/stylesheets']);
        } else if ('c' === p) {
            this.fs.copy(path.join(__dirname, 'templates', 'client'), '.');
            this.spawnCommandSync('mkdir', ['htmls', 'images', 'js', 'maps', 'scripts', 'stylesheets']);
        }
        this.spawnCommandSync('touch', ['README.md']);
        this.initNpmConfig();
        this.initBowerConfig();
        cb();
    },

    install: function () {

        var p = this.p;
        if (p && !('c' === p || 'f' === p)) {
            return;
        } else if (!p || 'f' === p) {
            this.npmInstall(['express@4.13.3', 'body-parser@1.14.2',
                'mongoose@4.4.4'], {'save': true}, function () {
            });

            this.npmInstall(['bower@1.7.1', 'gulp@3.8.11',
                'gulp-babel@6.1.2', 'babel-cli@6.6.0', 'babel-preset-es2015@6.6.0',
                'gulp-concat@2.5.2', 'gulp-sourcemaps@1.5.0',
                'gulp-uglify@1.1.0', 'gulp-postcss@6.1.0',
                'autoprefixer@6.3.3', 'postcss-scss@0.1.6',
                'gulp-sass@2.2.0', 'browser-sync@2.8.2'], {'saveDev': true}, function () {
            });

            this.bowerInstall(bowerDependencies, {'save': true}, function () {
                this.spawnCommandSync('mv', ['-f', 'bower.json', 'bower_components', 'client']);
            }.bind(this));
        } else if ('c' === p) {
            this.npmInstall(['bower@1.7.1', 'gulp@3.8.11',
                'gulp-babel@6.1.2', 'babel-cli@6.6.0', 'babel-preset-es2015@6.6.0',
                'gulp-concat@2.5.2', 'gulp-sourcemaps@1.5.0',
                'gulp-uglify@1.1.0', 'gulp-postcss@6.1.0',
                'autoprefixer@6.3.3', 'postcss-scss@0.1.6',
                'gulp-sass@2.2.0', 'browser-sync@2.8.2'], {'saveDev': true}, function () {
            });

            this.bowerInstall(bowerDependencies, {'save': true}, function () {
                this.spawnCommandSync('mv', ['-f', 'bower.json', 'bower_components', 'client']);
            }.bind(this));
        }
    },

    done: function () {

    }
});