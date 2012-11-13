"use strict";

var fs = require("fs"),
    path = require("path"),
    _ = require("underscore"),
    isLicense = require("./isLicense.js");

/**
 * checks the License of a single module-folder
 *
 * @param folder
 * @return {Object}
 */
function checkModuleLicense(folder) {

    var licensePath = folder + "/LICENSE",
        readMePath = folder + "/README.md",
        licenseContent;

    //check for LICENSE File First
    if(fs.existsSync(licensePath)){
        licenseContent = fs.readFileSync(licensePath, "utf-8");
        return { isMIT : isLicense.mit(licenseContent), content : licenseContent };
    }
    //Maybe in the README
    else if(fs.existsSync(readMePath)) {
        licenseContent = fs.readFileSync(readMePath, "utf-8");
        return { isMIT : isLicense.mit(licenseContent), content : "Check the README" };
    }
    else {
        return { isMIT : false, content : "not found" };
    }
}

/**
 * check all licenses of your node_modules
 * @param {String} rootDir your modules' root dir
 */
function checkLicenses(rootDir){

    var licenses = {},
        nodeModulesFolder = path.resolve(rootDir, "./node_modules"),
        moduleFolders = fs.readdirSync(nodeModulesFolder),
        res;

    _(moduleFolders).each(function(module) {
        licenses[module] = checkModuleLicense(nodeModulesFolder + "/" + module);
    });

    return licenses;
}

/**
 * writes all License-information in a single file
 * called LICENSES
 *
 * @param rootDir the rootDir of your module
 */
function writeLicensesFile(rootDir) {

    var licenses = checkLicenses(rootDir),
        licensesFileContent = "LICENSES " + "\n \n";

    _(licenses).each(function(licenseData, licenseName) {

        licensesFileContent += licenseName + " : ";

        if(licenseData.isMIT) {
            licensesFileContent += "MIT";
        }
        else {
            licensesFileContent += "Unknown License";
        }

        licensesFileContent += "\n \n";

        if(licenseData.content) {
            licensesFileContent += licenseData.content + "\n \n";
        }

    });

    fs.writeFileSync(rootDir + "/LICENSES", licensesFileContent, "utf-8");
}

exports.checkLicenses = checkLicenses;
exports.writeLicensesFile = writeLicensesFile;