"use strict";

var fs = require("fs"),
    path = require("path"),
    _ = require("underscore");

var _MIT = 'Permission is hereby granted, free of charge, ' +
        'to any person obtaining a copy of this software and associated ' +
        'documentation files (the "Software"), to deal in the Software without restriction,' +
        ' including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,' +
        ' and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, ' +
        'subject to the following conditions: The above copyright notice and this permission notice shall be included ' +
        'in all copies or substantial portions of the Software.';

function containsMITLicense(str) {
    return str.indexOf("(The MIT License)") !== -1 || str.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").indexOf(_MIT.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ")) !== -1;
}

function checkModuleLicense(folder) {

    var licensePath = folder + "/LICENSE",
        readMePath = folder + "/README.md",
        licenseContent;

    //check for LICENSE File First
    if(fs.existsSync(licensePath)){
        licenseContent = fs.readFileSync(licensePath, "utf-8");
    }
    //Maybe in the README
    else if(fs.existsSync(readMePath)) {
        licenseContent = fs.readFileSync(readMePath, "utf-8");
    }
    else {
        return false;
    }

    return { isMIT : containsMITLicense(licenseContent), content : licenseContent };
}

/**
 * check all licenses of your node_modules
 * creates a LICENCES file in given rootDir.
 * @param {String} rootDir your applications root dir
 */
function checkLicenses(rootDir){

    var licensesFileContent = "",
        nodeModulesFolder = path.resolve(rootDir, "./node_modules");

    var moduleFolders = fs.readdirSync(nodeModulesFolder),
        res;

    _(moduleFolders).each(function(module) {
        res = checkModuleLicense(nodeModulesFolder + "/" + module);
        licensesFileContent += "\n" + module + " : " + res.isMIT + "\n";
    });

    fs.writeFileSync(rootDir + "/LICENSES", licensesFileContent, "utf-8");
}

exports.checkLicenses = checkLicenses;