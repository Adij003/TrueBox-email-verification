const mongoose = require('mongoose');
const Cipher = require('../utils/cipher-util');
const Helper = require('../utils/helper-util');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    api: { type: mongoose.Schema.Types.Mixed, required: true },
    teamMembers: [
        {
            email: { type: String, required: true },
            sharedOn: { type: Date, default: Date.now },
            permissionType: { type: String, enum: ["read", "write"], required: true },
            folders: { type: [String], default: [] } 
        }
    ],
    sharedWithMe: [
        {
            sharedBy: { type: String, required: true },
            sharedOn: { type: Date, default: Date.now },
            permissionType: { type: String, enum: ["read", "write"], required: true }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Static method to signup the user
userSchema.statics.signUp = function(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            var [err, duser] = await Helper.to(this.findOne({ userId: userId }));

            if (err) {
                throw err;
            }

            if (duser) {
                return resolve(duser);
            }

            // Create a new user instance
            const newUser = new this({
                userId: userId,
                api: {
                    apiKey: Cipher.createSecretKey(10),
                    secretKey: Cipher.createSecretKey(16),
                }
            });

            // Save the user to the database
            await newUser.save();
            return resolve(newUser);
        } catch (err) {
            return reject(err);
        }
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;


