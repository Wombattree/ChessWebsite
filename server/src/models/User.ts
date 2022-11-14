import { Model, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser
{
	userName: string,
	email: string,
	password: string,
	wins: number,
	losses: number,
	draws: number,
}

interface IUserMethods
{
	IsCorrectPassword(password: string): boolean
}

type UserModel = Model<IUser, {}, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>(
{
	userName: 
	{
		type: String,
		required: true,
		trim: true
	},
	email: 
	{
		type: String,
		required: true,
		unique: true
	},
	password: 
	{
		type: String,
		required: true,
		minlength: 5
	},
	wins: 
	{
		type: Number,
		default: 0,
	},
	losses: 
	{
		type: Number,
		default: 0,
	},
	draws: 
	{
		type: Number,
		default: 0,
	},
});

schema.method("IsCorrectPassword", async function IsCorrectPassword(password: string): Promise<boolean>
{
	return await bcrypt.compare(password, this.password);
});

const User = model<IUser, UserModel>("User", schema);
export default User;

// const UserSchema = new Schema
// ({
// 	userName: {
// 		type: String,
// 		required: true,
// 		trim: true
// 	},
// 	email: {
// 		type: String,
// 		required: true,
// 		unique: true
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 		minlength: 5
// 	},
// 	wins: {
// 		type: Number,
// 		default: 0,
// 	},
// 	losses: {
// 		type: Number,
// 		default: 0,
// 	},
// 	draws: {
// 		type: Number,
// 		default: 0,
// 	},
// });

// Set up pre-save middleware to create password
// UserSchema.pre('save', async function(next) 
// {
// 	if (this.isNew || this.isModified('password')) 
// 	{
// 		const saltRounds = 10;
// 		this.password = await bcrypt.hash(this.password, saltRounds);
// 	}

// 	next();
// });

// // Compare the incoming password with the hashed password
// UserSchema.methods.IsCorrectPassword = async function (password: string): Promise<boolean>
// {
//   	return await bcrypt.compare(password, this.password);
// };

// const User = mongoose.model('User', UserSchema);

// export default User;