import { generateAccessToken,generateRefreshToken } from '../Utils/gennerateToken.js';
import User from '../models/User.js';
import bcrypt from "bcryptjs";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const accessToken = generateAccessToken(user);
    console.log("Generated access token:", accessToken);
    const refreshToken = generateRefreshToken(user);
    console.log("Generated refresh token:", refreshToken);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "Login successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const register = async (req, res) => {
    try{
        const { username, email, password  } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });       
     
        console.log("New user created:", newUser);
        res.status(201).json({ message: "User registered successfully"});
    }catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      })
      .json({ message: "Access token refreshed" });

  } catch (err) {
    return res.status(403).json({ message: "Refresh token expired" });
  }
};
const logout = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const user = await User.findOne({ refreshToken: token });
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }   
        user.refreshToken = null;
        await user.save();
        res.json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }   
}

const profile = async (req, res) => {
    const {_id, username, email, role} = req.user;
    res.json({ user: { _id, username, email, role } });
}
export { login, register , refreshToken, logout, profile};