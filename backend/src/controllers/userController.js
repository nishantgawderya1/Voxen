import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { meeting as Meeting } from "../models/meetingModel.js";
import { signToken } from "../middleware/auth.js";
import {
  validateRegistration,
  validateCredentials,
  validateMeeting,
} from "../utils/validate.js";

const BCRYPT_ROUNDS = 12;

// Internal failures are logged server-side and reported generically. Echoing
// the exception back leaked bcrypt/Mongoose internals to anyone who sent a
// malformed body.
const fail = (res, e, where) => {
  console.error(`[${where}]`, e);
  return res
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .json({ message: "Something went wrong. Please try again." });
};

const badRequest = (res, errors) =>
  res.status(httpStatus.BAD_REQUEST).json({ message: errors[0], errors });

const register = async (req, res) => {
  const { errors, value } = validateRegistration(req.body || {});
  if (errors.length) return badRequest(res, errors);

  try {
    const hashedPassword = await bcrypt.hash(value.password, BCRYPT_ROUNDS);
    const newUser = await User.create({
      name: value.name,
      username: value.username,
      password: hashedPassword,
    });

    // Sign the user straight in — making them re-enter credentials they just
    // typed is friction with no security benefit.
    return res.status(httpStatus.CREATED).json({
      message: "User registered successfully",
      token: signToken(newUser),
      user: { name: newUser.name, username: newUser.username },
    });
  } catch (e) {
    // The unique index is the real duplicate check; the pre-flight findOne it
    // replaced could interleave with a concurrent signup.
    if (e?.code === 11000) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "Username already taken" });
    }
    return fail(res, e, "register");
  }
};

const login = async (req, res) => {
  const { errors, value } = validateCredentials(req.body || {});
  if (errors.length) return badRequest(res, errors);

  try {
    const user = await User.findOne({ username: value.username }).select(
      "+password"
    );

    // Same response for "no such user" and "wrong password" so the endpoint
    // can't be used to enumerate which accounts exist.
    const okPassword =
      user && (await bcrypt.compare(value.password, user.password));
    if (!okPassword) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }

    return res.status(httpStatus.OK).json({
      token: signToken(user),
      user: { name: user.name, username: user.username },
    });
  } catch (e) {
    return fail(res, e, "login");
  }
};

const addToActivity = async (req, res) => {
  const { errors, value } = validateMeeting(req.body || {});
  if (errors.length) return badRequest(res, errors);

  try {
    await Meeting.create({
      user_id: req.user.username,
      meetingCode: value.meeting_code,
      name: value.meeting_name,
    });

    return res
      .status(httpStatus.CREATED)
      .json({ message: "Added code to history" });
  } catch (e) {
    return fail(res, e, "addToActivity");
  }
};

const getAllActivity = async (req, res) => {
  try {
    const meetings = await Meeting.find({ user_id: req.user.username })
      .sort({ date: -1 })
      .limit(200)
      .lean();

    return res.status(httpStatus.OK).json(meetings);
  } catch (e) {
    return fail(res, e, "getAllActivity");
  }
};

export { register, login, addToActivity, getAllActivity };
