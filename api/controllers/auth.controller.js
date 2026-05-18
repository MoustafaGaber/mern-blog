import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email }).select("+password");
    if (!validUser) {
      return next(errorHandler(400, "User not found or password is incorrect"));
    }
    const isMatch = bcrypt.compareSync(password, validUser.password);
    if (!isMatch) {
      return next(errorHandler(400, "User not found or password is incorrect"));
    }
    const { password: pass, ...userWithoutPassword } = validUser._doc;

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User logged in successfully",
        data: userWithoutPassword,
      });
  } catch (error) {
    next(error);
  }
};
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const hashPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({ username, email, password: hashPassword });
    //remove password
    const { password: pass, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      sucuess: true,
      message: "User created successfully",
      datat: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// تأكد من مسار الموديل عندك

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  console.log( req.body);

  try {
    let user = await User.findOne({ email });

    // 1. لو المستخدم مش موجود.. هننشأ حساب جديد فوراً
    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
        
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      
      // تأمين تنظيف اليوزر نيم من أي مسافات زائدة
      const cleanUsername = name.toLowerCase().split(' ').join('') + Math.random().toString(36).slice(-4);

      user = new User({
        username: cleanUsername,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      // حفظ المستخدم الجديد في قاعدة البيانات
      await user.save();
    }

    // 2. إنشاء الـ Token (شغال سلاسة للقديم وللجديد بعد الحفظ)
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    // 3. 👑 التعديل السحري: تحويل آمن لكائن جافا سكريبت لمنع إيرور الـ _doc
    const userObject = user.toObject();
    const { password, ...rest } = userObject;

    // 4. إعدادات الـ Cookie الموحدة
    const cookieOptions = {
      httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
      cookieOptions.sameSite = 'none';
      cookieOptions.secure = true;
    }

    // 5. إرسال الرد النهائي الموحد للطرفين
    return res
      .status(200)
      .cookie('access_token', token, cookieOptions)
      .json({
        success: true,
        message: "User logged in successfully",
        data: rest, 
      });

  } catch (error) {
    console.error( error.message);
    next(error);
  }
};