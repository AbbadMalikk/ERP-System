import jwt from 'jsonwebtoken';

const generateTokenAndSetCookies = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
        expiresIn: '30m' // Token will expire in 2 hours
    });

    res.cookie("jwt", token, {
        httpOnly: true, // makes it more secure 
        maxAge: 30 * 60 * 1000, // 30 mins in milliseconds
        sameSite: "strict", // CSRF protection
    });
    return token;
};

export default generateTokenAndSetCookies;
