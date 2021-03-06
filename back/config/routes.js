/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  'GET /recordings': { action: 'find-recordings-and-replies' },
  'GET /recordings/:id': { action: 'find-recordings-and-replies' },
  'POST /recordings/user/:userId/parent/:parentId?': { action: 'recording-uploading' },
  'DELETE /favs/recording/:recordingId/user/:userId': { action: 'delete-fav-by-user-recording' },
  'DELETE /stars/recording/:recordingId/user/:userId': { action: 'delete-star-by-user-recording' },
  'DELETE /shares/recording/:recordingId/user/:userId': { action: 'delete-share-by-user-recording' },
  'DELETE /replies/recording/:recordingId/user/:userId': { action: 'delete-reply-by-user-recording' }

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
