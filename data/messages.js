// This data file should export all functions using the ES6 standard as shown in the lecture code
import {groups} from '../config/mongoCollections.js'
import {messages} from '../config/mongoCollections.js'
import {validate} from 'email-validator';
import {ObjectId} from 'mongodb';
import {groupsData} from './index.js';
import {usersData} from './index.js';
import {messagesData} from './index.js';

const exportedMethods = {

  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async createMessage(message, senderGroupId, receiverGroupId, timestamp) {
    
  }, 

  async getAllMessages(groupId) {

  },

  async removeMessage(messageId) {
    
  }
};

export default exportedMethods;