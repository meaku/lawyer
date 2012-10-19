"use strict";

var fs = require("fs"),
    path = require("path"),
    _ = require("underscore");

var _MIT = 'Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.';

/**
 * check all licenses of your node_modules
 * creates a LICENCES file in given rootDir.
 * @param {String} rootDir your applications root dir
 */
function checkLicenses(rootDir){

    var licensesFileContent = "";

    function addLicenceInfo(module, folder) {

        var licensePath = folder + "/LICENSE",
            licenseContent;

        licensesFileContent += module.toUpperCase();

        if(fs.existsSync(licensePath)){

            licenseContent = fs.readFileSync(licensePath, "utf-8");

            var isMITLicense = licenseContent.indexOf("(The MIT License)") !== -1 || licenseContent.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").indexOf(_MIT.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ")) !== -1;

            if(isMITLicense) {
                licensesFileContent += ": MIT" + "\n";

            }
            else {
                licensesFileContent += "\n";
            }

            licensesFileContent += licenseContent;
        }
        else {
            licensesFileContent += ": No LICENCE file found." + "\n";
        }

        licensesFileContent += "\n";
        licensesFileContent += "\n";
    }

    var nodeModulesFolder = path.resolve(rootDir, "./node_modules");

    var moduleFolders = fs.readdirSync(nodeModulesFolder);

    _(moduleFolders).each(function(moduleFolder) {
        addLicenceInfo(moduleFolder, nodeModulesFolder + "/" + moduleFolder);
    });

    fs.writeFileSync(rootDir + "/LICENSES", licensesFileContent, "utf-8");
}

exports.checkLicenses = checkLicenses;