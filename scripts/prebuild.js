"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var environmentFilesDirectory = path.join(__dirname, '../src/myenvironments');
var targetEnvironmentTemplateFileName = 'myenvironment.js.template';
var targetEnvironemntFileName = 'myenvironment.js';
var defaultEnvValues = {
};
var environmentTemplate = fs.readFileSync(path.join(environmentFilesDirectory, targetEnvironmentTemplateFileName), { encoding: 'utf-8' });
var obj = Object.assign({}, defaultEnvValues, process.env);
var output = ejs.render(environmentTemplate, obj);
fs.writeFileSync(path.join(environmentFilesDirectory, targetEnvironemntFileName), output);
process.exit(0);
