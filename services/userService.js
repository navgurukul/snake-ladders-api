const User = require('../models/user');
const Room = require('../models/room');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



class UserService {

  async createUser(user) {
    try {
      const newUser = await User.query().insert(user);
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUsers() {
    try {
      const users = await User.query();
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(id) {
    try {
      const user = await User.query().findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      console.log(user, 'user in service file')
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateUser(id, user) {
    try {
      const updatedUser = await User.query().patchAndFetchById(id, user);
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUser(id) {
    try {
      const rowsDeleted = await User.query().deleteById(id);
      if (rowsDeleted === 0) {
        throw new Error('User not found');
      }
      return rowsDeleted;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(email, password) {
    try {
      const user = await User.query().findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if (!isPasswordValid) {
      //   throw new Error('Invalid password');
      // }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      return token;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}






module.exports = new UserService();