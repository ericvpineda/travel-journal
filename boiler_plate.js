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
      
    </body>
    </html>`
}

const projectName = "project"
fs.mkdirSync(projectName.toLowerCase());
fs.writeFileSync(`${projectName}/style.css`, "");
fs.writeFileSync(`${projectName}/index.html`, boilerPlate("project"));
fs.writeFileSync(`${projectName}/script.js`, "");
