const express = require("express");
const app = express();
const  ServiceProvider = require("../models/ServiceProvider.js");
const mongoose= require("mongoose");
const data= require("./daata.js");

 main()
    .then((res) => { console.log("db connected succesfully !"); })
    .catch(err => console.log(err));
    
    async function main() {
        await mongoose.connect('mongodb://127.0.0.1:27017/KarmaSetuV');
    }


    let initdata = async () => {
        try {
            await ServiceProvider.deleteMany({}); // 🔥 Clear all existing documents
            let dd = await ServiceProvider.insertMany(data.data); 
            console.log("Initialization complete", dd.length, "documents inserted.");
        } catch (err) {
            console.error("Error initializing data:", err);
        }
    };
    

    initdata();