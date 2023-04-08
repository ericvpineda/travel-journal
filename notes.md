Questions to think about:
- Why use non-sql db vs sql db:
    - Can retieve two schemas at same time 
- MongoDB schema design
    - https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1
- Problems to overcome:
    - Using postman to find server validation issues: 
        - schema used rating.body vs html used review[description]
- different header protections from helmet package

Future features:
- redirect back to previous page after successfully logging in
- store author username on each review (to prevent having to populate within camp and review in travel.js route)
- have different forms of index page (ex: only text, only pictures, etc.)
- have default image if all images are deleted
    - restrict type of image uploaded? (server, client)
- normalize picture size on slideshow
- spinner with async data for index.ejs scroll 
- Add "currently no reviews" to show.ejs
- Add profile page

Features added:
- star validation for non-star selection (js modification)
- real time of travel post last updated (show.ejs, index.ejs)
- basic account page (features: delete act)
- added light background to make page fuller

Issues:
- find way to validate strong password from user
- travel.post('/') route - need to validate travel before uploading image`````
    - multer first uploads while parsing, then sends parsed body to req.body 
- how to limit number of uploads to upload to cloudinary
- mapbox route index.js not working
- Heroku no longer has free dyno tier 
    - change hosting website

Solved Issues:
- Passport duplicate emails from different accounts 
    --> remove 'unique' key from users model 
- session returnTo in users.post('/login') not return to previous login route
    --> add 'keepSessionInfo : true' into passport.authenticate()
- reviews made by other people is attributed only to Alice
    --> show.ejs -- compare current authoer to review author (not travel author)
- changin width of mapbox-sdk-js div causes pin to not be centered 
    --> inside of map.on("style.load", () => {...}), add in map.resize(); 

EJS Shortcuts: https://marketplace.visualstudio.com/items?itemName=DigitalBrainstem.javascript-ejs-support

