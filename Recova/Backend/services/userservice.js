import usermodel from "../models/usermodel.js"


export const createuser = async (
    {email,password}) => {
    if(!email || !password)
        {  return { error: "Email and password are required" };
    }   

    const hashedpassword = await usermodel.hashpassword(password);    
   
        // ✅ Create user in MongoDB
        const user = await usermodel.create({
            email,
            password: hashedpassword,
        });

        return user; // ✅ Return the created user
   
}