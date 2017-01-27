'use strict';

/*
 *
 *  MODULES IMPORT
 *
 **/
var fs = require('fs');

/*
 *
 *  VERIABLES / CONSTANTS
 *
 **/
var PRIVATE = {};
var COMMAND = {};
var CONFIG = {
    encode: 'utf8'
};
var LOG = {
    err: {
        invalidDir: '# Invalid directory: ',
        impossibleMkdirDir: '# Directory not created: ',
        invalidFile: '# Invalid file: '
    },
    action: {
        verifyDir: '# Directory OK: ',
        mkdir: '# Creating directory: ',
        mkdirDone: '# Created directory: ',
        rm: '# Removing directory: ',
        rmDone: '# Removed directory: ',
        readingFile: '# Reading file: ',
        writeFile: '# Writing file: '
    }
};
var REGEX = {
    markup: /\[(.*)\]\((.*\".*(\$\$iMkd\$\$)(.+)?\"(.+)?)(\))/gi
};
var _inputFile = './tmp-test/input.md'
var _outputDir = './dist';
var _outputFile = 'output.md';

/*
 *
 *  PRIVATE METHODS / COMMANDS
 *
 **/
COMMAND.verifyDir = function(path) {
    try {
        console.log(LOG.action.verifyDir, path);
        return fs.readdirSync(path);                                                           
    } catch(e) {
        console.log(LOG.err.invalidDir, path);
        return false;
    }
};

COMMAND.mkdir = function(path) {
    console.log(LOG.action.mkdir, path);
    try {
        fs.mkdirSync(path);
        console.log(LOG.action.mkdirDone);
    } catch(e) {
        console.log(LOG.err.impossibleMkdirDir, path);
        return false;
    };
};

COMMAND.rm = function(path) {
    console.log(LOG.action.rm, path);
    fs.rmdirSync(path);  
    console.log(LOG.action.rmDone, path);
};

COMMAND.readFile = function(path, file, options) {
    try {
        console.log(LOG.action.readingFile, file);
        return fs.readFileSync(file, options).toString();
    } catch(e) {
        console.log(LOG.err.invalidFile, file);
        throw e;
    };
};

PRIVATE.fileMarkupReplace = function(file) {
    return file.replace(REGEX.markup, 'test');
};

PRIVATE.markupDiscovery = function(file) {
    return file.match(REGEX.markup);
};

PRIVATE.hasMarkups = function(file) {
    return !!PRIVATE.markupDiscovery(file).length;
};

/*
 *
 *  PUBLIC METHODS / EXPORT MODULE
 *
 **/
exports.iMkdInit = function(data) {
    var hasOutputDir = COMMAND.verifyDir(_outputDir);
    var inputFile;
    var markups;
    var newFile;

    if(!hasOutputDir || !hasOutputDir.length) {    
        if (!hasOutputDir.length) {
            COMMAND.rm(_outputDir);
        }        
        COMMAND.mkdir(_outputDir);
    } else {
        COMMAND.rm(_outputDir);
        COMMAND.mkdir(_outputDir);
    }
    
    inputFile = COMMAND.readFile(null, _inputFile, CONFIG.encode);
    markups = PRIVATE.markupDiscovery(inputFile);
    newFile = PRIVATE.fileMarkupReplace(inputFile);
    console.log('# markups: ', markups);
    console.log('# newFile: ', newFile)
};
