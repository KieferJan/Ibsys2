import * as mongoose from "mongoose";


const elementSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: 'Another Element with this ID already exists'
    },
    titel: String,
    xmlData: String
},{versionKey: false});

let Element  = module.exports= mongoose.model("Element", elementSchema);


export = Element;

