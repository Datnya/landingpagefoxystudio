const fs = require('fs');
const files = ['index.html', 'nosotros.html', 'servicios.html', 'contacto.html', 'servicio-detalle.html', 'src/style.css'];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/href="\//g, 'href="');
  content = content.replace(/src="\//g, 'src="');
  content = content.replace(/url\('\/fondo/g, "url('../fondo");
  fs.writeFileSync(f, content);
  console.log('Fixed ' + f);
});
