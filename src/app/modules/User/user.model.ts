import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { role, status } from './user.constant';
import { IUser, IUserMethods, IUserModel } from './user.interface';

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: role,
      default: 'user',
    },
    status: {
      type: String,
      enum: status,
      default: 'active',
    },
    refreshToken: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Custom hooks

// Modified password fields before save to database
userSchema.pre('save', async function (next) {
  try {
    // Check if the password is modified or this is a new user
    if (this.isModified('password') || this.isNew) {
      const hashPassword = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt),
      );
      this.password = hashPassword;
    }
    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    next(error);
  }
});

// Check that the user exists to database
userSchema.statics.isUserExists = async function (email: string) {
  const result = await User.findOne({ email }).select('+password');
  return result;
};

// Check the password is correct
userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Custom method for generating access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    config.access_token_secret!,
    {
      expiresIn: config.access_token_expiry,
    },
  );
};

// Custom method for generating refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.refresh_token_secret!,
    {
      expiresIn: config.refresh_token_expiry,
    },
  );
};

// compare last password change time with jwt time
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

const User = model<IUser, IUserModel>('User', userSchema);

export default User;
