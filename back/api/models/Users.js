/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    username: { type: 'string', required: true, unique: true },
    profilePic: { type: 'string' },

    recordings: {
      collection: 'recordings',
      via: 'user'
    },

    favs: {
      collection: 'recordings',
      via: 'userId',
      through: 'favs'
    },

    replies: {
      collection: 'recordings',
      via: 'userId',
      through: 'replies'
    },

    shares: {
      collection: 'recordings',
      via: 'userId',
      through: 'shares'
    },

    stars: {
      collection: 'recordings',
      via: 'userId',
      through: 'stars'
    }
  }

};

