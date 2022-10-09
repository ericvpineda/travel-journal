Questions to think about:
- Why use non-sql db vs sql db:
    - Can retieve two schemas at same time 
- MongoDB schema design
    - https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1
- Problems to overcome:
    - Using postman to find server validation issues: 
        - schema used rating.body vs html used review[description]

Future features:
- redirect back to previous page after successfully logging in
- store author username on each review (to prevent having to populate within camp and review in travel.js route)
- method to delete users profile
- have different forms of index page (ex: only text, only pictures, etc.)

Issues:
- find way to validate strong password from user

Solved Issues:
- Passport duplicate emails from different accounts 
    - remove 'unique' key from users model 
- session returnTo in users.post('/login') not return to previous login route
    - add 'keepSessionInfo : true' into passport.authenticate()
- reviews made by other people is attributed only to Alice
    - show.ejs -- compare current authoer to review author (not travel author)

EJS Shortcuts: https://marketplace.visualstudio.com/items?itemName=DigitalBrainstem.javascript-ejs-support