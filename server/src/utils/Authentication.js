import jwt from 'jsonwebtoken';
var secret = 'mysecretsshhhhh';
var expiration = '2h';
var Authentication = /** @class */ (function () {
    function Authentication() {
    }
    Authentication.AuthenticationMiddleware = function (_a) {
        var req = _a.req;
        // Allows token to be sent via req.body, req.query, or headers
        var token = req.body.token || req.query.token || req.headers.authorization;
        // ["Bearer", "<tokenvalue>"]
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }
        if (!token)
            return req;
        try {
            var data = jwt.verify(token, secret, { maxAge: expiration }).data;
            req.user = data;
        }
        catch (_b) {
            console.log('Invalid token');
        }
        return req;
    };
    Authentication.SignToken = function (user) {
        var payload = new Payload(user.userName, user.email, user._id);
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    };
    return Authentication;
}());
export default Authentication;
var Payload = /** @class */ (function () {
    function Payload(userName, email, _id) {
        this.userName = userName;
        this.email = email;
        this._id = _id;
    }
    return Payload;
}());
