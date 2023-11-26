// This data file should export all functions using the ES6 standard as shown in the lecture code
import {groups} from '../config/mongoCollections.js'
import {conversations} from '../config/mongoCollections.js'
import {validate} from 'email-validator';
import {ObjectId} from 'mongodb';
import {groupsData} from './index.js';
import {usersData} from './index.js';
import {messagesData} from './index.js';
import helpers from '../helpers.js';

const exportedMethods = {

  /* Creates a new conversation between two groups (checks if the groups are matched as well) */
  /* Params: 
  firstGroupId (str: ObjectId of a sender group) 
  secondGroupId (str: ObjectId of receiving group - must be matched with secondGroupId) 

  Returns: string representation of ObjectId of the created conversation
  */
  async createNewConversation(firstGroupId, secondGroupId) {
    /* Check for valid ObjectId for both groups */
    firstGroupId = helpers.checkId(firstGroupId, 'firstGroupId');
    secondGroupId = helpers.checkId(secondGroupId, 'secondGroupId');

    /* Check if firstGroup is matched with secondGroup and vice versa */
    const groupsCollection = await groups();
    let firstGroupMatches = groupsCollection.find({_id: new ObjectId(firstGroupId)}, {_id: 0, matches: 1}).toArray();
    let secondGroupMatches = groupsCollection.find({_id: new ObjectId(secondGroupId)}, {_id: 0, matches: 1}).toArray();
    if (!(firstGroupMatches.includes(secondGroupId))) throw "Error: The group with id secondGroupId has not matched with group with firstGroupId";
    if (!(secondGroupMatches.includes(firstGroupId))) throw "Error: The group with id firstGroupId has not matched with group with secondGroupId";

    /* Insert new conversation into conversations collection + return its associated id as a string */
    const conversationsCollection = await conversations();
    let newConversation = {
      participants: [firstGroupId, secondGroupId],
      messages: []
    }
    const insertInfo = await conversationsCollection.insertOne(newConversation);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not create conversation';
    return insertInfo.insertedId.toString();
  },
  
  /* Creates a new message from senderId (which is a groupId belonging to the conversation with conversationId) 
    to the other participant of the conversation */
  /* Params:
  conversationId (str: ObjectId of conversation to create the message under)
  senderId (str: ObjectId of sender group; receiver id not needed because it is the other id in the conversation)
  message (str: message to be sent to receiving group; 1 <= message.length <= 1024)

  Returns inserted message if successful
  */
  async createMessage(conversationId, senderId, message) {
    /* Check for valid ObjectId for conversationId and senderId; check for valid message */
    conversationId = helpers.checkId(conversationId, 'conversationId');
    senderId = helpers.checkId(senderId, 'senderId');
    if (typeof message !== 'string') throw "Error: message must be a string";
    if ((message.trim().length === 0) || (message.length > 1024)) throw "Error: message must be between 1 and 1024 characters";

    /* Attempt to append the new message to the messages array for the current conversation */
    const conversationsCollection = await conversations();
    const updatedConversation = await conversationsCollection.updateOne(
      {_id: new ObjectId(eventId)}, 
      {
        $push: {
          messages: {
            _id: new ObjectId(),
            senderId: senderId, 
            text: message
          }
        }
      }
    );
    if (!updatedConversation) throw "Error: Could not create new message for this conversation";
    
    return message;
  }, 

  /* Returns an array of conversation id's associated with a given group id 
  Param: groupId (str: ObjectId of group from which to retrieve all conversations)
  */
  async getAllConversations(groupId) {

  },

  /* Returns all messages associated with a conversationId as an array of message objects 
  Param: conversationId (str: ObjectId of conversation to retrieve all messages from)
  Each message object in the returned array has the following format:
  {
      "messageId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6312",
      "senderId": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6313",
      "text": "Hi there!"
  }
  */
  async getAllMessages(conversationId) {

  },

  /* Removes a conversation with given id from the conversations collection; returns true if successful
  Param: conversationId (str: ObjectId of conversation to remove)
  */
  async removeConversation(conversationId) {
    
  }
};

export default exportedMethods;