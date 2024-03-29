# travel_journal
![Travel Journal home page](./public/img/home_page.jpg)

## Description
- Node.js application to create, review, and pin travels in blog-style journal.
- Website: [https://travel-journal-nlm9.onrender.com](https://travel-journal-nlm9.onrender.com)

## Routes
 - Home: Introduction page that links to travel posts of all users.
 - Login: Page to enter user account information
 - Register: Create instance of user using username, email and password.
 - New Travel: Create instance of travel event with title, description, location, price, and image.
 - All Travels: Shows all travels of all users in database. 
 - Account: Simple information of user including picture, short description and travel posts. 

## API
- Back-end server: [Node.js](https://nodejs.org/en/)
- Front-end framework: [Bootstrap 5.2](https://blog.getbootstrap.com/2022/07/19/bootstrap-5-2-0/)
- No-SQL Database: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- ODM: [Mongoose](https://mongoosejs.com/)
- Javascript Data Validation: [Joi](https://github.com/hapijs/joi)
- Web application framework: [Express](https://expressjs.com/) 
- 2D Map: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/guides/)
- Review stars: [Starability](https://github.com/LunarLogic/starability)

## Security Coverage 
- No-SQL Mongo Injection: [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize) 
- Cross-site scripting: [sanitize-html](https://www.npmjs.com/package/sanitize-html)
- Http header security: [helmet](https://www.npmjs.com/package/helmet)
- Authentication: [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose)
- Server-side validation: [Joi](https://www.npmjs.com/package/joi)
