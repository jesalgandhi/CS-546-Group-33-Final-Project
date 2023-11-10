import {groups} from '../config/mongoCollections.js'
import {messages} from '../config/mongoCollections.js'
import {validate} from 'email-validator';
import {ObjectId} from 'mongodb';
import validation from '../helpers.js';


const exportedMethods = {

  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async create(
    groupName,
    groupDescription,
    groupLocation,
    users,
    reviews,
  ) {
    
  },
  
  async getAll() {
    
  },
  
  async get(groupId) {
    
  },
  
  async remove(groupId) {
    
  },
  
  async update(
    groupId,
    groupName,
    groupDescription,
    groupLocation,
    users,
    reviews,
  ) {
    
  }
};

export default exportedMethods;
