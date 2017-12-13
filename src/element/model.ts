import * as mongoose from "mongoose";

//Define beautifyUnique for better unique Validation error
let beautifyUnique = require('mongoose-beautiful-unique-validation');

//Definiton of Enum for Validation
let schemaLayoutsVal = ["navigation", "scroll-x", "scroll-y", "matrix"];
let structureComponentTypeVal = ["nav", "text", "img"];

const elementSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: 'Another Element with this ID already exists'
    },
    level: Number,
    pos: Number,
    parent: String,
    icon: String,
    data: {
        heading: String,
        layout: {
            type: String,
            enum: schemaLayoutsVal
        },
        structure: [{
            id: {
                type: String,
                required: true,
                unique: 'Another DataStructure with this ID already exists'
            },
            componentType: {
                type: String,
                required: true,
                enum: structureComponentTypeVal
            },
            content: String,
            width: {
                type: String,
                required: false
            },
            imgHeading: String,
        }]
    }
},{versionKey: false});

//Enable the beautifyUnique Plugin
elementSchema.plugin(beautifyUnique);
elementSchema.index({'$**': "text"})

let Element  = module.exports= mongoose.model("Element", elementSchema);


export = Element;

