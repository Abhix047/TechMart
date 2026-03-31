import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    // We can use TTL index to automatically remove expired tokens from the blacklist
    // Assuming tokens expire in 30 days (as per jwt config)
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "30d", 
    },
  },
  {
    timestamps: true,
  }
);

const BlacklistedToken = mongoose.model("BlacklistedToken", blacklistedTokenSchema);

export default BlacklistedToken;
