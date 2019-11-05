const mongoose = require("mongoose");

const uniqueVal = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: { type: String, unique: true, minlength: 3 },
  name: { type: String },
  passwordHash: { type: String },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
    }
  ]
});

userSchema.plugin(uniqueVal);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

module.exports = mongoose.model("User", userSchema);
