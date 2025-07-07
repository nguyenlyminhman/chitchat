import {
  DynamoDBClient
} from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
export const docClient = DynamoDBDocumentClient.from(client)

// Helper function to build PK/SK
export const buildKeys = {
  user: (userId: string) => ({ PK: `USER#${userId}`, SK: 'PROFILE' }),
  session: (userId: string, sessionId: string) => ({ PK: `USER#${userId}`, SK: `SESSION#${sessionId}` }),
  relationship: (userId: string, otherId: string) => ({ PK: `USER#${userId}`, SK: `REL#${otherId}` }),
  conversation: (convoId: string) => ({ PK: `CONVO#${convoId}`, SK: 'META' }),
  participant: (convoId: string, userId: string) => ({ PK: `CONVO#${convoId}`, SK: `PART#${userId}` }),
  userConvoLink: (userId: string, convoId: string) => ({ PK: `USER#${userId}`, SK: `CONVO#${convoId}` }),
  message: (convoId: string, messageId: string) => ({ PK: `CONVO#${convoId}`, SK: `MESSAGE#${messageId}` }),
  messageLike: (messageId: string, userId: string) => ({ PK: `MESSAGE#${messageId}`, SK: `LIKE#${userId}` }),
  messageReply: (replyToId: string, messageId: string) => ({ PK: `MESSAGE#${replyToId}`, SK: `REPLY#${messageId}` }),
  notification: (userId: string, notificationId: string) => ({ PK: `USER#${userId}`, SK: `NOTI#${notificationId}` }),
}

// Example: Insert a user
export async function createUser(userId: string, data: {
  name: string
  email: string
  avatar?: string
  password?: string
}) {
  return docClient.send(new PutCommand({
    TableName: 'ChitChat',
    Item: {
      ...buildKeys.user(userId),
      userId,
      ...data,
      isOnline: false,
      createdAt: new Date().toISOString(),
    },
  }))
}

// Example: Create session
export async function createSession(userId: string, sessionId: string, device: string, ip: string) {
  return docClient.send(new PutCommand({
    TableName: 'ChitChat',
    Item: {
      ...buildKeys.session(userId, sessionId),
      userId,
      sessionId,
      device,
      ip,
      createdAt: new Date().toISOString(),
      expiresAt: Math.floor(Date.now() / 1000) + 3600 * 24 * 7, // 7 days TTL
    }
  }))
}

// Example: Send a message
export async function sendMessage(convoId: string, messageId: string, senderId: string, content: string, type = 'text') {
  return docClient.send(new PutCommand({
    TableName: 'ChitChat',
    Item: {
      ...buildKeys.message(convoId, messageId),
      convoId,
      messageId,
      senderId,
      content,
      type,
      createdAt: new Date().toISOString(),
    }
  }))
}

// Get all messages in a conversation
export async function getMessagesInConvo(convoId: string) {
  return docClient.send(new QueryCommand({
    TableName: 'ChitChat',
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :msgPrefix)',
    ExpressionAttributeValues: {
      ':pk': `CONVO#${convoId}`,
      ':msgPrefix': 'MESSAGE#'
    },
  }))
}

// Like a message
export async function likeMessage(messageId: string, userId: string) {
  return docClient.send(new PutCommand({
    TableName: 'ChitChat',
    Item: {
      ...buildKeys.messageLike(messageId, userId),
      messageId,
      userId,
      likedAt: new Date().toISOString(),
    },
  }))
}

// Send friend request
export async function addFriendRequest(userId: string, friendId: string) {
  return docClient.send(new PutCommand({
    TableName: 'ChitChat',
    Item: {
      ...buildKeys.relationship(userId, friendId),
      userId,
      relatedUserId: friendId,
      relationshipStatus: 'PENDING',
      createdAt: new Date().toISOString(),
    }
  }))
}

// Accept friend request
export async function acceptFriendRequest(userId: string, friendId: string) {
  const now = new Date().toISOString()
  await Promise.all([
    docClient.send(new PutCommand({
      TableName: 'ChitChat',
      Item: {
        ...buildKeys.relationship(userId, friendId),
        userId,
        relatedUserId: friendId,
        relationshipStatus: 'FRIEND',
        createdAt: now,
      }
    })),
    docClient.send(new PutCommand({
      TableName: 'ChitChat',
      Item: {
        ...buildKeys.relationship(friendId, userId),
        userId: friendId,
        relatedUserId: userId,
        relationshipStatus: 'FRIEND',
        createdAt: now,
      }
    }))
  ])
}

// Block user
export async function blockUser(userId: string, blockedUserId: string) {
  return docClient.send(new PutCommand({
    TableName: 'ChitChat',
    Item: {
      ...buildKeys.relationship(userId, blockedUserId),
      userId,
      relatedUserId: blockedUserId,
      relationshipStatus: 'BLOCKED',
      createdAt: new Date().toISOString(),
    }
  }))
}

// Get friends list
export async function getFriendsList(userId: string) {
  const res = await docClient.send(new QueryCommand({
    TableName: 'ChitChat',
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :rel)',
    FilterExpression: 'relationshipStatus = :status',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':rel': 'REL#',
      ':status': 'FRIEND',
    },
  }))
  return res.Items || []
}

// Send notification
export async function sendNotification(toUserId: string, notification: {
  notificationId: string
  type: 'MESSAGE_NEW' | 'FRIEND_REQUEST' | 'FRIEND_ACCEPTED' | 'LIKE' | 'REPLY' | 'GROUP_INVITE'
  fromUserId: string
  convoId?: string
  messageId?: string
}) {
  return docClient.send(new PutCommand({
    TableName: 'ChitChat',
    Item: {
      ...buildKeys.notification(toUserId, notification.notificationId),
      ...notification,
      createdAt: new Date().toISOString(),
      isRead: false,
    },
  }))
}

// Get all notifications for a user
export async function getNotifications(userId: string) {
  const res = await docClient.send(new QueryCommand({
    TableName: 'ChitChat',
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':prefix': 'NOTI#'
    },
  }))
  return res.Items || []
}

// Mark notification as read
export async function markNotificationRead(userId: string, notificationId: string) {
  return docClient.send(new UpdateCommand({
    TableName: 'ChitChat',
    Key: buildKeys.notification(userId, notificationId),
    UpdateExpression: 'SET isRead = :read',
    ExpressionAttributeValues: {
      ':read': true
    },
  }))
}

