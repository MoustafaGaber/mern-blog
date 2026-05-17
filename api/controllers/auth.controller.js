import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/errorHandler.js';

export const signUp = async (req, res,next) => {
   const { username, email, password } = req.body
   if (!username || !email || !password || username === '' || email === '' || password === ''  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const hashPassword=bcrypt.hashSync(password, 10);
    
    const user = await User.create({ username, email, password: hashPassword });
    //remove password
    const  {password:pass, ...userWithoutPassword} = user._doc;
   
    res.status(201).json({sucuess: true, message: 'User created successfully',datat: userWithoutPassword});
  } catch (error) {
   
    next(error)
  }
}