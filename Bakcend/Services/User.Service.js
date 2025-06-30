const UserModel = require("../models/User")
const createUser =async (
    {
        fullname,email,phone,password,profileImage,location
    }
)=>{
    const user = UserModel.create({
        fullname,email,phone,password,profileImage,location
    })
    return user;
}

module.exports = createUser;