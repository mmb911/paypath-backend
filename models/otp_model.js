import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
  email: {
    type: String,
  },
  otp: {
    type: String,
  },
  expiry: {
    type: Number,
  },
});

const OTPSchema = mongoose.model("OTPSchema", otpSchema);

//module.exports = OTPSchema;
export default OTPSchema
