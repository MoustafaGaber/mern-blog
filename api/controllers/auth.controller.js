import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signUp = async (req, res) => {
   const { username, email, password } = req.body
   if (!username || !email || !password || username === '' || email === '' || password === ''  ) {
   res.status(400).json({success: false, message: 'All fields are required'});
  }

  try {
    const hashPassword=bcrypt.hashSync(password, 10);
    
    const user = await User.create({ username, email, password: hashPassword });
    //remove password
    const  {password:pass, ...userWithoutPassword} = user._doc;
   
    res.status(201).json({sucuess: true, message: 'User created successfully',datat: userWithoutPassword});
  } catch (error) {
    res.status(500).json({success: false, message: `Error creating user - ${error}`});
  }
}