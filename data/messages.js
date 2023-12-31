// This data file should export all functions using the ES6 standard as shown in the lecture code
import {groups} from '../config/mongoCollections.js'
import {conversations} from '../config/mongoCollections.js'
import {validate} from 'email-validator';
import {ObjectId} from 'mongodb';
import {groupsData} from './index.js';
import {usersData} from './index.js';
// import {messagesData} from './index.js';
import helpers from '../helpers.js';

const exportedMethods = {

  /* Creates a new conversation between two groups (checks if the groups are matched as well) */
  /* Params: 
  firstGroupId (str: ObjectId of a sender group) 
  secondGroupId (str: ObjectId of receiving group - must be matched with secondGroupId) 

  Returns: ObjectId of the created conversation
  */
  async createNewConversation(firstGroupId, secondGroupId) {
    /* Check for valid ObjectId for both groups */
    firstGroupId = helpers.checkId(firstGroupId, 'firstGroupId');
    secondGroupId = helpers.checkId(secondGroupId, 'secondGroupId');

    //TODO: ensure that a convo between the two groups doesn't already exist (use getConversationIdbyGroupIds for this)

    /* Check if firstGroup is matched with secondGroup and vice versa */
    // const groupsCollection = await groups();
    // let firstGroupMatches = groupsCollection.find({_id: new ObjectId(firstGroupId)}, {_id: 0, matches: 1}).toArray();
    // let secondGroupMatches = groupsCollection.find({_id: new ObjectId(secondGroupId)}, {_id: 0, matches: 1}).toArray();
    // if (!(firstGroupMatches.includes(secondGroupId))) throw "Error: The group with id secondGroupId has not matched with group with firstGroupId";
    // if (!(secondGroupMatches.includes(firstGroupId))) throw "Error: The group with id firstGroupId has not matched with group with secondGroupId";

    /* Insert new conversation into conversations collection + return its associated id as a string */
    const conversationsCollection = await conversations();
    let newConversation = {
      participants: [new ObjectId(firstGroupId), new ObjectId(secondGroupId)],
      messages: []
    }
    const insertInfo = await conversationsCollection.insertOne(newConversation);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not create conversation';
    return insertInfo.insertedId;
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
    message = message.trim();
    if (typeof message !== 'string') throw "Error: message must be a string";
    if ((message.length === 0) || (message.length > 1024)) throw "Error: message must be between 1 and 1024 characters";

    /* Attempt to append the new message to the messages array for the current conversation */
    const conversationsCollection = await conversations();
    const updatedConversation = await conversationsCollection.updateOne(
      {_id: new ObjectId(conversationId)}, 
      {
        $push: {
          messages: {
            // _id: new ObjectId(),
            senderId: senderId, 
            text: message
          }
        }
      }
    );
    if (!updatedConversation) throw "Error: Could not create new message for this conversation";
    
    return message;
  }, 

  /* Returns an array of conversations associated with a given group id 
  Param: groupId (str: ObjectId of group from which to retrieve all conversations)
  */
  async getAllConversations(groupId) {
    groupId = helpers.checkId(groupId, 'groupId'); // check groupId

    /* Query that finds all conversations where groupId exists in participants array */
    const conversationsCollection = await conversations();
    const allConversations = await conversationsCollection.find(
      { participants: { $elemMatch: { $eq: new ObjectId(groupId) } } },
      {_id: 1},
    ).toArray();

    return allConversations;
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
    conversationId = helpers.checkId(conversationId); // check conversationId
    const conversationsCollection = await conversations();
    const matchedConversation = await conversationsCollection.findOne({_id: new ObjectId(conversationId)});
    if (!matchedConversation) throw "Error: Conversation with the given id not found";
    return matchedConversation.messages;
  },

  /* Returns a 2-element array of participants of a conversation, given conversationId */
  async getParticipants(conversationId) {
    conversationId = helpers.checkId(conversationId);
    const conversationsCollection = await conversations();
    const participants = await conversationsCollection.findOne(
      {_id: new ObjectId(conversationId)}, 
      { projection: { _id: 0, participants: 1 } }
    );
    return participants.participants;
  },

  /* Removes a conversation with given id from the conversations collection; returns true if successful, else false
  Param: conversationId (str: ObjectId of conversation to remove)
  */
  async removeConversation(conversationId) {
    conversationId = helpers.checkId(conversationId); // check conversationId
    const conversationsCollection = await conversations();
    const removedConversation = await conversationsCollection.deleteOne({_id: new ObjectId(conversationId)});
    if (!removedConversation) throw "Error: could not remove attendee";
    return removedConversation.acknowledged;
  },

  /* Returns conversationId given two groupIds (current group and a different group)
     If no convo exists between the two groups, returns undefined
    Params: thisGroupId (str: ObjectId of current group) 
            otherGroupId (str: ObjectId of other group) */
  async getConversationIdByGroupIds(thisGroupId, otherGroupId) {
    thisGroupId = helpers.checkId(thisGroupId);
    otherGroupId = helpers.checkId(otherGroupId);
    if (thisGroupId === otherGroupId) throw "Error: group IDs are the same";
    let participants_ = [new ObjectId(thisGroupId), new ObjectId(otherGroupId)];
    const conversationsCollection = await conversations();
    let conversationId = await conversationsCollection.find(
      {participants: {$all: participants_}}
      // {_id: 1}
    ).toArray();
    if (conversationId.length !== 0) return conversationId[0]._id.toString();
    else return undefined;
  }, 

  async removeAllConversationsByGroup(groupId) {
    const conversationsCollection = await conversations();
    groupId = helpers.checkId(groupId, 'group ID');
  
    const conversationsToDelete = await conversationsCollection.find({
      participants: new ObjectId(groupId)
    }).toArray();
  
    // if (conversationsToDelete.length === 0) {
    //   throw `No conversations found for group with ID ${groupId}`;
    // }
  
    for (const conversation of conversationsToDelete) {
      await conversationsCollection.deleteOne({ _id: conversation._id });
    }
  
    return `All conversations removed for group with ID ${groupId}`;
  }
  
};

export default exportedMethods;