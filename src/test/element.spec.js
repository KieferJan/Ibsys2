"use strict";
/**
 * Created by Tobias on 17.05.2017.
 */
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../element/index');
let should = chai.should();
const controller = require('../element/controller');
chai.use(chaiHttp);
// -------------------------------------------------------------------------------------------- //
let elementWithDataStructure = {
    level: "1",
    pos: 1,
    parent: null,
    icon: "path/to/icon",
    __v: 0,
    data: {
        heading: "Investition und Finanzierung",
        layout: "navigation",
        structure: {
            id: "1_0_0x1",
            componentType: "text",
            content: "Zahlungsverkehr im In- & Ausland abwickeln Liquidität vorhalten und sichern"
        }
    }
};
let elementWithWrongDataStructure = {
    level: "1",
    pos: 1,
    parent: null,
    icon: "path/to/icon",
    __v: 0,
    data: {
        heading: "Investition und Finanzierung",
        layout: "navigation",
        structure: {
            id: "1_0_2x1",
            componentType: "asdasdasd",
            content: "Zahlungsverkehr im In- & Ausland abwickeln Liquidität vorhalten und sichern"
        }
    }
};
let elementWithDataStructureChanged = {
    "level": 2,
    "pos": 1,
    "parent": null,
    "icon": "path/to/icon",
    "data": {
        "heading": "Investition und Finanzierung",
        "structure": {
            "id": "1_0_8x1",
            "componentType": "text",
            "contentTxt": "Zahlungsverkehr test In- & Ausland abwickeln\nLiquidität vorhalten und sichern"
        },
        "layout": "navigation"
    }
};
// -------------------------------------------------------------------------------------------- //
/*
 * Test the /GET route of all elements
 */
describe('/GET element', function () {
    it('Test to Get all elements', function (done) {
        chai.request(server)
            .get('/element')
            .end(function (err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            done();
        });
    });
});
/*
 * Test the /GET route of a specific  element id 9_9_9 which does'nt exist
 */
describe('/GET element with specific id', function () {
    it('Test to Get a specific element with id: 9_9_9', function (done) {
        chai.request(server)
            .get('/element/9_9_9')
            .end(function (err, res) {
            res.should.have.status(404);
            done();
        });
    });
});
/*
 * Test the /POST route of a specific  element id 2_0_0
 */
describe('/POST element with specific id', function () {
    it('Test to post a specific element with id: 2_0_0', function (done) {
        chai.request(server)
            .post('/element/2_0_0')
            .send(elementWithDataStructure)
            .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('id');
            res.body.id.should.equal('2_0_0');
            done();
        });
    });
});
/*
 * Test the /POST route of a specific  element id 2_1_0 with wrong dataStructure
 */
describe('/POST element with specific id', function () {
    it('Test to post a specific element with id: 2_1_0 with wrong dataStructure', function (done) {
        chai.request(server)
            .post('/element/2_1_0')
            .send(elementWithWrongDataStructure)
            .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.have.property('errors');
            res.body.message.should.equal('Element validation failed: data.structure.0.componentType: `asdasdasd` is not a valid enum value for path `componentType`.');
            done();
        });
    });
});
/*
 * Test the /POST route of a specific  element id 2_0_0 again to produce error
 */
describe('/POST element with specific id', function () {
    it('Test to post a specific element with id: 2_0_0 to produce error', function (done) {
        chai.request(server)
            .post('/element/2_0_0')
            .send(elementWithDataStructure)
            .end(function (err, res) {
            res.body.should.have.property('errors');
            res.body.message.should.equal('Validation failed');
            done();
        });
    });
});
/*
 * Test the /GET route of a specific  element id 2_0_0 which exists
 */
describe('/GET element with specific id', function () {
    it('Test to Get a specific element with id: 2_0_0', function (done) {
        chai.request(server)
            .get('/element/2_0_0')
            .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('data');
            res.body.data.id.should.equal('2_0_0');
            done();
        });
    });
});
/*
 * Test to get the new createContentArray for the PDF Export
 */
describe('Tests the createContentArray Function', function () {
    it('Test to get the new createContentArray for the PDF Export', function (done) {
        let testString = '* First, *Second* Third **Fourth** Fifth';
        let array = controller.createContentArray(testString);
        if (array.length === 5 && array.indexOf('- First, ') === 0 && array.indexOf('-?3Second') === 1) {
            done();
        }
        else {
            throw new Error;
        }
    });
    it('Test to get the new createContentArray for the PDF Export (with Headline)', function (done) {
        let testString2 = '## First, *Second* Third **Fourth** Fifth';
        let array = controller.createContentArray(testString2);
        if (array.length === 5 && array.indexOf('-?1 First, ') === 0) {
            done();
        }
        else {
            throw new Error;
        }
    });
});
