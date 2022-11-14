import jwt from 'jsonwebtoken';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

export default class Authentication
{
	static AuthenticationMiddleware({ req }: any)
	{
		// Allows token to be sent via req.body, req.query, or headers
		let token = req.body.token || req.query.token || req.headers.authorization;

		// ["Bearer", "<tokenvalue>"]
		if (req.headers.authorization) { token = token.split(' ').pop().trim(); }

		if (!token) return req;

		try 
		{
			const { data }: any = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} 
		catch { console.log('Invalid token'); }

		return req;
	}

	static SignToken(user: any)
	{
		let payload: Payload = new Payload(user.userName, user.email, user._id);
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	}
}

class Payload
{
	userName: string;
	email: string;
	_id: string;

	constructor (userName: string, email: string, _id: string)
	{
		this.userName = userName;
		this.email = email;
		this._id = _id;
	}
}