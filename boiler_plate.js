const fs = require('fs');

const boilerPlate = (name) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name}</title>
    </head>
    <body>
      <h1>${name}</h1>
      
    </body>
    </html>`
}

// Note: css/js imports folder 
fs.mkdirSync("public");

// Note: models folder
fs.mkdirSync("models");

// Note: templers folder (rendered with ejs templating)
const projectName = "views"
fs.mkdirSync(projectName);
fs.mkdirSync(projectName + "/partials");
fs.writeFileSync(`${projectName}/new.ejs`, boilerPlate("new"));
fs.writeFileSync(`${projectName}/edit.ejs`, boilerPlate("edit"));
fs.writeFileSync(`${projectName}/show.ejs`, boilerPlate("show"));
fs.writeFileSync(`${projectName}/home.ejs`, boilerPlate("home"));
