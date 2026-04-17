const fs = require('fs');

['index.html', 'servicios.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/\?id=/g, '#');
    fs.writeFileSync(f, content);
    console.log('Fixed links in ' + f);
  }
});

const detailFile = 'servicio-detalle.html';
if (fs.existsSync(detailFile)) {
  let content = fs.readFileSync(detailFile, 'utf8');
  content = content.replace(
    "const urlParams = new URLSearchParams(window.location.search);\n        const serviceId = urlParams.get('id');",
    "let serviceId = window.location.hash.substring(1);\n        if(!serviceId) {\n            const urlParams = new URLSearchParams(window.location.search);\n            serviceId = urlParams.get('id');\n        }"
  );
  fs.writeFileSync(detailFile, content);
  console.log('Fixed script in ' + detailFile);
}
