import multer from 'multer';
import path from 'path';

// Configuração do armazenamento para salvar os arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  './uploads'); // Pasta onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Filtro para aceitar apenas arquivos de imagem
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Somente arquivos de imagem são permitidos'), false);
    }
};

// Middleware de upload
const upload = multer({ storage, fileFilter });

export default upload;