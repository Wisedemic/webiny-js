// @flow
const ncp = require("ncp").ncp;
const path = require("path");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const exec = require("child_process").exec;
const targz = require("targz");

function asyncCopyTo(from, to) {
    return asyncMkDirP(path.dirname(to)).then(
        () =>
            new Promise((resolve, reject) => {
                ncp(from, to, error => {
                    if (error) {
                        // Wrap to have a useful stack trace.
                        reject(new Error(error));
                        return;
                    }
                    resolve();
                });
            })
    );
}

function asyncExecuteCommand(command, options = {}) {
    return new Promise((resolve, reject) =>
        exec(command, options, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        })
    );
}

function asyncExtractTar(options) {
    return new Promise((resolve, reject) =>
        targz.decompress(options, error => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        })
    );
}

function asyncMkDirP(filepath) {
    return new Promise((resolve, reject) =>
        mkdirp(filepath, error => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        })
    );
}

function asyncRimRaf(filepath) {
    return new Promise((resolve, reject) =>
        rimraf(filepath, error => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        })
    );
}

module.exports = {
    asyncCopyTo,
    asyncExecuteCommand,
    asyncExtractTar,
    asyncRimRaf
};
