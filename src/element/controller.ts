///<reference path="../../typings/globals/node/index.d.ts"/>
//Import Model and mongoose
import * as Element from './model';
import {Request, Response} from 'express';
const mongoose = require('mongoose');
const fs = require('fs');
const pdfDocument = require('pdfkit');
const path = require('path');
const mime = require('mime');
const multiparty = require('multiparty');
const js2xmlparser = require("js2xmlparser");
import {} from 'jasmine';
/**
 * Controller Module
 * @class Controller
 *
 */

//Tells mongoose the name of the db where it should connect to
mongoose.connect("mongodb://localhost/awpDB");
mongoose.set('debug', true);

/*POST CONTROLLER DOWNLOAD XML*/
let xmldownload = function(req: Request, res: Response): void {
   let xml = js2xmlparser.parse("name", req.body);

   fs.writeFile('test.xml', xml, (err) => {
       if (err) throw err;

       let stat = fs.statSync('test.xml');
       res.writeHead(200, {
           'Content-Type' : 'text/xml',
           'Content-Length' : stat.size
       });

       let readStream = fs.createReadStream('test.xml');
       readStream.pipe(res);

       readStream.on('close', function() {
           fs.unlink('test.xml');
       })
   });


};



module.exports = {
    xmlDownload: xmldownload
};
