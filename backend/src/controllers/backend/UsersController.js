const User = require("../../models/User");
const Logs = require("../../utils/logs-util");
const Response = require("../../utils/response-util");
const Helper = require("../../utils/helper-util");
const { validationResult, param, body } = require("express-validator");

module.exports = {
/**
* Create user
* @param {*} req
* @param {*} res
*/
  create: async (req, res) => {
    try {
      if (!req.body.userId) {
        throw "User id is required";
      }

      const user = await User.signUp(req.body.userId);
      res.send(Response.success("User created successfully", user));
    } catch (err) {
      Logs.error(err);
      res
        .status(500)
        .json(
          Response.error(
            "Some error occurred while creating the User.",
            err.message
          )
        );
    }
  },

/**
* This method is use for retrieve a single record.
* @param {*} req
* @param {*} res
* @returns User
*/
  getOne: async (req, res) => {
    try {
      // Define your validation rules here
      const validationRules = [
        param("userId", "Invalid user ID").custom(Helper.isValidObjectId),
      ];

      // Run the validation rules
      await Promise.all(
        validationRules.map(async (rule) => await rule.run(req))
      );

      // Get validation errors
      const errors = validationResult(req);

      // Check for validation errors
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(Response.error("Fields are required.", errors.array()[0]));
      }

      const userId = req.params.userId;

      // const user = await User.findById(userId)
      const user = await User.findOne({ userId: userId });

      if (!user) {
        throw "User not found!";
      }

      return res.json(Response.success("Get User", user));
    } catch (err) {
      Logs.error(err);
      res.status(400).json(Response.error(err));
    }
  },

/**
* This method is use to update the single record.
* @param {*} req
* @param {*} res
* @returns User
*/

  updateOne: async (req, res) => {
    try {
      // Define your validation rules here
      const validationRules = [
        param("userId", "Invalid user ID")
          .notEmpty()
          .custom(Helper.isValidObjectId),
        body("username").optional().escape(),
        body("email")
          .optional()
          .isEmail()
          .withMessage("Invalid email address")
          .escape(),
        body("password")
          .optional()
          .isLength({ min: 6 })
          .withMessage("Password must be at least 6 characters"),
      ];

      // Run the validation rules
      await Promise.all(
        validationRules.map(async (rule) => await rule.run(req))
      );

      // Get validation errors
      const errors = validationResult(req);

      // Check for validation errors
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(Response.error("Fields are required.", errors.array()[0]));
      }

      const userId = req.params.userId;

      const { username, email, password } = req.body;

      if (!username && !email && !password) {
        throw "Atleast one of the field is required username, email or password.";
      }

      let updateFields = {};

      if (email) {
        // Check if the provided email already exists
        let existingUser = await User.findOne({ _id: { $ne: userId }, email });
        if (existingUser) {
          throw "User with this email already exists";
        }

        updateFields.email = email;
      }

      if (username) {
        updateFields.username = username;
      }

      if (password) {
        updateFields.password = password;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
      });

      if (!updatedUser) {
        throw "User not found!";
      }

      return res.json(
        Response.success("User updated successfully", updatedUser)
      );
    } catch (err) {
      Logs.error(err);
      res.status(500).json(Response.error(err));
    }
  },

/**
* This method is use to fetch all the user record.
* @param {*} req
* @param {*} res
* @returns User
*/
  getAll: async (req, res) => {
    try {
      const Users = await User.find();
      return res.json(Response.success("All User", Users));
    } catch (err) {
      Logs.error(err);
      res.status(500).json(Response.error(err));
    }
  },

/**
* This method is used to add a team member
* @param {*} req
* @param {*} res
* @returns User
*/
  addTeamMember: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, sharedOn, permissionType, folders = [] } = req.body;
      const userId = req.user.id;

      const user = await User.findOne({ userId });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const newTeamMember = {
        email,
        sharedOn: sharedOn || new Date(),
        permissionType,
        folders,
      };

      user.teamMembers.push(newTeamMember);
      await user.save();

      res.status(200).json(Response.success('Successfully added team member', user));
    } catch (error) {
      console.error("Error adding team member:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  getTeamMembers: async (req, res) => {
    try{
      const userId = req.user.id;
      const user = await User.findOne({userId: userId})
      res.status(200).json(Response.success("User Details are: ", user))
    } catch(error){
      res.status(500).json(Response.error('Error fetching user info', error))
    }
  },

/**
* This method is use to delete a single record.
* @param {*} req
* @param {*} res
* @returns User
*/

  deleteOne: async (req, res) => {
    try {
      const validationRules = [
        param("userId", "Invalid user ID").custom(Helper.isValidObjectId),
      ];
      
      await Promise.all(
        validationRules.map(async (rule) => await rule.run(req))
      );

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(Response.error("Fields are required.", errors.array()[0]));
      }

      const userId = req.params.userId;

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        throw "User not found!";
      }

      req.session.destroy((err) => {
        if (err) {
          Logs.error(err);
        }
      });

      return res.json(Response.success("Get User", deletedUser));
    } catch (err) {
      Logs.error(err);
      res.status(500).json(Response.error(err));
    }
  },
};
