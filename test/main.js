'use strict';

const electron = require('electron');
const app = electron.app;
var BrowserWindow = require('browser-window');
var mainWindow = null;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.loadURL('file://' + __dirname + '/index.html');
});

var fs = require("fs");
var nativeImage = require('native-image');
const ipcMain = require('electron').ipcMain;
ipcMain.on("saveAsPng",function(e,args) {
//   nativeImage.createFromDataUrl(data).toPng();
//   fs.writeFile("out.png",)
});