const User = require("../models/userModel")
const bcrypt = require("bcrypt")

module.exports.register = async (req,res,next)=>{
  try{
    
    const { username , email , password } = req.body;
    const usernameCheck = await User.findOne({ username })
    
    if(usernameCheck){
      res.json({ msg: "Username Not Available"  , status: false})
    }
    const emailCheck = await User.findOne({ email })
    if(emailCheck){
      res.json({ msg: "Email Already Registered"  , status: false})
    }

      const hashedPassworrd = await bcrypt.hash(password,10);

      const user = await User.create({
        email,
        username,
        password: hashedPassworrd,
      })
      delete user.password;
      return res.json({status: true , user})
    }catch(err){
      next(err)
    }

}


module.exports.login = async (req,res,next)=>{

  try{

    const { email , password } = req.body;
    const user = await User.findOne({ email })
    
    if(!user){
      res.json({ msg: "Email is Incorrect"  , status: false})
    }
    const isValidPassword = await bcrypt.compare(password , user.password)
    if(!isValidPassword){
      res.json({ msg: "Password is Incorrect"  , status: false})
    }
    
    delete user.password
    return res.json({status: true , user})
  }catch(err){
    next(err);
  }

}

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req,res,next) => {
  try{
    const userId = req.params.id;
   const users = await User.find({_id:{$ne : userId}}).select([
    "email",
    "username",
    "avatarImage",
    "_id",
   ]);
   return res.json({users}) 
  }catch(err){
    next(err);
  }
}