import { validateToken } from "../services/authenticaton.js";

function checkAuthenticationCookie(cookieName) {
    return (req , res , next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload
        } catch (error) {}

        return next();
    };
}

export {
    checkAuthenticationCookie,
}