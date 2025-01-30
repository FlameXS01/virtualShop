const fs = require('fs').promises;
const path = require('path');

const deleteFile = async (filePath) => {
    try {
        await fs.access(filePath); // Verificar que el archivo existe
        await fs.unlink(filePath);
        //console.log(`Archivo eliminado: ${filePath}`);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`Archivo no encontrado: ${filePath}, continuando...`);
            return true; // Consideramos exitoso si el archivo ya no existe
        }
        console.error(`Error eliminando archivo: ${filePath}`, err);
        throw new Error(`Error eliminando archivo adjunto: ${err.message}`);
    }
};

module.exports = deleteFile;