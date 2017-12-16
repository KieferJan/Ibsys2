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

/*POST controller**/
/**
 * Author: Jan Kiefer
 *
 * POST controller
 *
 * This method creates a new Element and store it in the database.
 * @method createElement
 * @param req: {Element}
 * @param res: {Element}
 * @author Jan Kiefer
 */
let createElement = function (req: Request, res: Response): void {
    let newElement = new Element(req.body);
    newElement.id = req.params.id;

    newElement.save((err) => {
        if (err) {
            res.json(err);
            return;
        }
        res.json(newElement);
    });
};

/**
 * Author: Jan Kiefer
 *
 * GET Element Controller
 *
 * This Method searches a database entry by id.
 * @method getElement
 * @param req {String} Element ID
 * @param res {Element}
 * @author Jan Kiefer
 */
let getElement = function (req: Request, res: Response): void {
    let query = {id: req.params.id};

    Element.findOne(query, {_id: 0}, function (err, Element) {
        if (err) {
            res.json({info: 'error at get request', error: err});
            return;
        }
        ;
        if (Element) {
            res.json({data: Element});
        } else {
            res.status(404);
            res.json({info: 'No such Element found with id:' + req.params.id});
        }

    });
};
/**
 * Author: Jan Kiefer
 *
 * GET all Element controller
 *
 * @method getAllElements
 * @param req {}
 * @param res {[Element]}
 * @Author Jan Kiefer
 */
let getAllElements = function (req: Request, res: Response): void {
    Element.find({}, {_id: 0}, (err, Elements) => {
        if (err) {
            res.json({info: 'error during find Elements', error: err});
            return;
        }
        res.json({data: Elements});
    });
};

//Tells mongoose the name of the db where it should connect to
mongoose.connect("mongodb://localhost/awpDB");
mongoose.set('debug', true);

/*POST CONTROLLER DOWNLOAD XML*/
let xmldownload = function(req: Request, res: Response): void {
   let xml = js2xmlparser.parse("input", req.body);

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
    xmlDownload: xmldownload,
    getAllElements: getAllElements,
    getElement: getElement,
    createElement: createElement

};
