// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'client/';

    if (req.originalUrl.includes('/admin/noticias')) {
      folder += 'img/index/noticias/';
    } else if (req.originalUrl.includes('/admin/eventos')) {
      folder += 'img/index/eventos/';
    } else if (req.originalUrl.includes('/admin/egresados')) {
      folder += 'img/index/egresados/';
    } else if (req.originalUrl.includes('/admin/comunicados')) {
      // Decidir subcarpeta según el campo
      if (file.fieldname === 'imagen') {
        folder += 'img/index/comunicados/';
      } else if (file.fieldname === 'archivo') {
        folder += 'docs/comunicados/';
      } else {
        folder += 'otros/';
      }
    } else if (req.originalUrl.includes('/admin/maestrias')) {
      folder += 'img/maestrias/';
    } else if (req.originalUrl.includes('/admin/doctorados')) {
      folder += 'img/doctorados/';
    } else {
      folder += 'otros/';
    }

    const uploadPath = path.join(__dirname, '..', '..', folder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '_' + cleanName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'imagen' && file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  if (file.fieldname === 'archivo') {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
  }
  cb(new Error('Tipo de archivo no permitido'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter
});

// ✅ Exporta la instancia directamente (compatible con .single(), .fields(), etc.)
module.exports = upload;