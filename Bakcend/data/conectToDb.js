const mongoose = require('mongoose')
function connectToDb(){
    main()
    .then((res) => { console.log("db connected succesfully !"); })
    .catch(err => console.log(err));
    async function main() {
        await mongoose.connect('mongodb://127.0.0.1:27017/KarmaSetuV');
    }
}




module.exports = connectToDb;