(function () {
    'use strict';
    angular.module('cleverdump', [])
        .controller('CopyController', function ($scope, $window) {
            var packageConfig = require('../package.json');
            var config = require('./config.json');
            var moment = require('moment');
            var ncp = require('ncp').ncp;
            var fs = require('node-fs');
            var glob = require('glob');

            var rmdir = require('rimraf');
            /*to switch to node context of Objects - such as Array / Function / RegExp*/
            var nwglobal = require('nwglobal');
            var dumpIndex = -1;
            $scope.messages = [];

            nextDump();
            var dumpsMade = 0;
            var dumpsRemoving = 0;
            var dumpsRemoved = 0;
            var removeOldDumpsFinished = false;

            function removeOldDumps() {
                setInfoMessage('Удаление старых дампов');
                for (var key in config.dumps) {
                    var dump = config.dumps[key];
                    removeOldDump(dump);
                }
                removeOldDumpsFinished = true;
                checkAllRemovingFinished();
            }

            function removingFinished(error) {
                dumpsRemoving--;
                if (error) {
                    setErrorMessage(error.toString());
                    console.log(error.toString());
                }
                checkAllRemovingFinished();
            }

            function checkAllRemovingFinished() {
                if (dumpsRemoving === 0 && removeOldDumpsFinished) {
                    var message = 'Удаление старых дампов завешено\n';
                    message = 'Удалено дампов: ' + dumpsRemoved;
                    setSuccessMessage(message);
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                    setTimeout(closeApp, 5000);
                }
            }

            function removeOldDump(dump) {
                console.log('[OLD DUMPS REMOVING] ' + dump.to);
                var files = fs.readdirSync(dump.to);
                console.log(files);
                var prefix = new RegExp(getDumpPrefix(dump));
                for (var key in files) {
                    var dir = files[key];
                    if (prefix.test(dir)) {
                        dir = dump.to + '/' + dir;
                        var date = new Date(fs.statSync(dir).mtime.getTime());
                        if (ifOld(date, dump.frequency)) {
                            dumpsRemoving++;
                            dumpsRemoved++;
                            console.log('[DUMP REMOVED]');
                            console.log(dir);
                            rmdir(dir, removingFinished);
                        }
                    }
                }
                checkAllRemovingFinished();

                function ifOld(date, frequency) {
                    switch (frequency) {
                        case 'daily':
                            return (new Date() - date) > 1000 * 60 * 60* 24 * 100;
                        case 'weekly':
                            return (new Date() - date) > 1000 * 60 * 60 * 24 * 365;
                        case 'yearly':
                            return false;
                        default:
                            return false;
                    }
                }
            }

            function getDumpPrefix(dump) {
                return packageConfig.name + '-' + dump.name + '-';
            }

            function nextDump() {
                dumpIndex++;
                if (dumpIndex < config.dumps.length) {
                    var dump = jQuery.extend({}, config.dumps[dumpIndex]);
                    console.log('[nextDump]', dumpIndex);
                    console.log('[dump.from]', dump.from);

                    dump.toFull = dump.to + '/' + getDumpPrefix(dump);
                    var postfix = '';
                    switch (dump.frequency) {
                        case 'daily':
                            postfix = moment().format('YYYY-MM-DD');
                            break;
                        case 'weekly':
                            postfix = moment().format('YYYY-w');
                            break;
                        case 'yearly':
                            postfix = moment().format('YYYY');
                            break;
                    }
                    glob(dump.toFull + postfix + '*', {}, function (er, files) {
                        console.log(dump.toFull + postfix);
                        console.log(files);
                        if (files.length !== 0) {
                            nextDump();
                        } else {
                            dump.toFull += dump.frequency == 'weekly' ? moment().format('YYYY-w__YYYY-MM-DD__HH-mm-ss') : moment().format('YYYY-MM-DD__HH-mm-ss');

                            if (dump.toSubdirectory) {
                                dump.toFull += '/' + dump.toSubdirectory;
                            }
                            var err = makeDump(dump);
                            if (err) {
                                setErrorMessage(err.toString());
                            }
                        }
                    });
                } else {
                    var message = 'Архивирование всех задач завершено\n';
                    message += 'Сделано дампов: ' + dumpsMade;
                    setSuccessMessage(message);
                    messageNext();
                    removeOldDumps();
                }
            }

            function makeDump(dump) {
                var err = checkDirSync(dump);
                return err ? err : makeCopy(dump);
            }

            function makeCopy(dump) {
                var message = 'Идет копирование\n';
                message += 'Из ' + dump.from + '\n';
                message += 'В ' + dump.toFull;
                setInfoMessage(message);

                if (!$scope.$$phase) {
                    $scope.$digest();
                }
                var options = {};
                if (dump.onlyCurrent) {
                    var currentDir = dump.from + '/' + dump.onlyCurrent.replace('%year', moment().format('YYYY'));
                    options.filter = nwglobal.RegExp(dump.from + '$' + '|' + currentDir);
                }
                ncp(dump.from, dump.toFull, options, function (err) {
                    if (err) {
                        setErrorMessage(err.toString());
                        return;
                    } else {
                        setSuccessMessage('Архивирование успешно завершено');
                        dumpsMade++;
                        nextDump();
                    }
                });
                return false;
            }

            function checkDirSync(dump) {
                /*creating directory*/
                var message = 'Создание директории\n';
                message += dump.toFull;
                setInfoMessage(message);
                console.log('[MAKE DIR CALL]');
                console.log(dump.toFull);
                return fs.mkdirSync(dump.toFull, '0777', true, true);
            }

            function messageNext() {
                $scope.messages.push({message: $scope.message, messageStatus: $scope.messageStatus});
            }

            function setInfoMessage(message) {
                setMessage(message, 'info');
            }

            function setSuccessMessage(message) {
                setMessage(message, 'success');
            }

            function setErrorMessage(message) {
                setMessage(message, 'error');
            }

            function setMessage(message, status) {
                $scope.message = message;
                $scope.messageStatus = status;
                console.log('[' + status + ']');
                console.log(message);
                if (!$scope.$$phase) {
                    $scope.$digest();
                }
            }

            function closeApp() {
                var close = require('./close');
                close(closeCallback);
                function closeCallback(changeDisk) {
                    if (changeDisk) {
                        messageNext();
                        setErrorMessage('Пора заменить диск');
                    } else {
                        var gui = require('nw.gui');
                        gui.App.quit();
                    }
                }
            }
        });
})();