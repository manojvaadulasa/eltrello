import bcryptjs from "bcryptjs";
import { Schema, model } from "mongoose";
import { UserDocument } from "../types/user.interface";
import validator from "validator";

const userSchema = new Schema<UserDocument>({
    'email':{
        type:String,
        required: true,
        validate:[validator.isEmail,"Invalid Email"],
        createIndexs : { unique : true }
    },
    'username':{
        type:String,
        required:true 
    },
    'password':{
        type:String,
        required: true,
        select:false // This ensures that whenever we retreive from the DB, this feild is never retreived. 
    }, // This will store the password as a plain string. We must not do that and we must hide the actual password. To do that, we must hash it.
},{
    timestamps : true   
});

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next();
    }    
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err as Error);        
    }
});

userSchema.methods.validatePassword = function (password:string) {
    return bcryptjs.compare(password, this.password);
}

export default model<UserDocument>("UserModel",userSchema);