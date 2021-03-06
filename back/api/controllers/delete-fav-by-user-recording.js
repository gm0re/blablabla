module.exports = {


  friendlyName: 'Delete fav by user id and recording id',


  description: 'Remove faved recording of a user.',


  inputs: {
    userId: {
      type: 'number',
      required: true
    },
    recordingId: {
      type: 'number',
      required: true
    },
  },


  exits: {

  },

  fn: async inputs => (
    Favs.destroy(inputs)
  )

};
