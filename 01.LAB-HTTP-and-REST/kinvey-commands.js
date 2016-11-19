// 09. Kinvey: Handshake
// Postman command: GET
// https://baas.kinvey.com/appdata/kid_rkBtiGRWe
// Authorization
// Type: Basic Auth
// username: ---
// password: ---


// 10. Kinvey: All Posts
// Postman command: GET
// https://baas.kinvey.com/appdata/kid_rkBtiGRWe/books
// Authorization
// Type: Basic Auth
// username: ---
// password: ---


// 11. Kinvey: Create New Post
// Postman command: POST
// https://baas.kinvey.com/appdata/kid_rkBtiGRWe/books
// Authorization
// Type: Basic Auth
// username: ---
// password: ---
// Body
// raw - JSON (application/json)
// {
//  "title":"New Title",
//  "body":"New Post Body"
// }


// 12. Kinvey: Delete a Post
// Postman command: DELETE
// https://baas.kinvey.com/appdata/kid_rkBtiGRWe/books/5830a5131217fb995515d480
// Authorization
// Type: Basic Auth
// username: ---
// password: ---


// 13. Kinvey: Edit a Post
// Postman command: PUT
// https://baas.kinvey.com/appdata/kid_rkBtiGRWe/books/5830a7181217fb995515d56f
// Authorization
// Type: Basic Auth
// username: ---
// password: ---
// Body
// raw - JSON (application/json)
// {
// "title":"edited title",
// "body":"edited author",
// "hidden":true
// }


// 14. Kinvey: Login
// Postman command: POST
// https://baas.kinvey.com/user/kid_rkBtiGRWe/login
// Authorization
// Type: Basic Auth
// username: {APP_ID}
// password: {APP_SECRET}
// Body
// raw - JSON (application/json)
// {
//    "username":"guest",
//    "password":"guest"
// }

// ===============================================================================================


//     LOGIN (Method POST)

//  https://baas.kinvey.com/user/APP_ID/login
//  For EXAMPLE: user=guest / pass=guest
//  Authorization: Base (with user & pass)
//      username: guest
//      password: guest

//     Body (JSON (application/json)):
//      {
//        "username":"guest",
//        "password":"guest"
//      }

// ===============================================================================================

//     LOGOUT (Method POST)

//     https://baas.kinvey.com/user/APP_ID/_logout
//         EXAMPLE: user=guest / pass=guest
//     Body (JSON): empty
//     Authorization: No Auth -> but in Headers ->
//     Authorization: Kinvey {authtoken->returned when login}