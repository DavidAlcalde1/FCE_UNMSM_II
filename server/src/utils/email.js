// server/src/utils/email.js
const nodemailer = require('nodemailer');

// Configuración para correo institucional UNMSM (SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Gmail funciona con correos UNMSM si usas contraseña de app
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,    
    pass: process.env.EMAIL_PASS     // Contraseña de app (no la del correo)
  }
});

// Mapeo de oficinas a correos
const correosOficinas = {
  fce: 'jalcaldeca@unmsm.edu.pe',        // Mi correo
  ocaa: 'ocaa.economia@unmsm.edu.pe',
  posgrado: 'informes-posgrado.economia@unmsm.edu.pe',
  cerseu: 'cerseu.economia@unmsm.edu.pe',
  cesepi: 'cesepi.economia@unmsm.edu.pe'
};

async function enviarCorreo(oficina, datos) {
  const destino = correosOficinas[oficina] || correosOficinas.fce;
  
  const info = await transporter.sendMail({
    from: `"FCE UNMSM" <${process.env.EMAIL_USER}>`,
    to: destino,
    subject: `Nuevo mensaje desde la web - ${oficina.toUpperCase()}`,
    html: `
      <h3>Nuevo contacto desde la web</h3>
      <p><strong>Oficina:</strong> ${oficina}</p>
      <p><strong>Nombre:</strong> ${datos.nombre}</p>
      <p><strong>Email:</strong> ${datos.email}</p>
      <p><strong>Teléfono:</strong> ${datos.telefono || 'No proporcionado'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${datos.mensaje}</p>
      <hr>
      <p>Accede al panel de administración para ver todos los mensajes.</p>
      <a href="http://localhost/admin/login" target="_blank">Panel de administración</a>
    `
  });

  console.log('Correo enviado:', info.messageId);
}

module.exports = { enviarCorreo };