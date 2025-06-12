const express = require('express');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos
app.use(express.static('public'));
app.use('/fonts', express.static('fonts'));

// Função para buscar arquivos de fonte recursivamente
function findFontFiles(dir, fontFiles = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // Recursivamente buscar em subdiretórios
            findFontFiles(filePath, fontFiles);
        } else if (path.extname(file).toLowerCase() === '.ttf') {
            // Adicionar arquivo TTF à lista
            const relativePath = path.relative('fonts', filePath).replace(/\\/g, '/');
            const fontName = path.basename(file, '.ttf');
            
            fontFiles.push({
                name: fontName,
                path: relativePath,
                fullPath: filePath.replace(/\\/g, '/')
            });
        }
    });
    
    return fontFiles;
}

// Função para buscar arquivos ASCII recursivamente
function findAsciiFiles(dir, asciiFiles = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursivamente buscar em subdiretórios
            findAsciiFiles(filePath, asciiFiles);
        } else {
            // Adicionar qualquer arquivo de texto à lista
            const ext = path.extname(file).toLowerCase();
            if (ext === '.nfo' || ext === '.txt' || ext === '.ans' || ext === '.asc' ||
                ext === '.diz' || ext === '.inc' || ext === '.add' || ext === '.rel' ||
                ext === '.ptl' || ext === '.tdt' || ext === '.ptg' || ext === '.lgn' ||
                ext === '.frm' || ext === '.sic' || ext === '.scr' || ext === '.bbs' ||
                ext === '.mcm' || ext === '.fsn' || ext === '.use' || ext === '.er' ||
                ext === '.ad' || ext === '.apr' || ext === '.may' || ext === '.nf0' ||
                ext === '.nfi' || ext === '.tiz' || ext === '.whq' || ext === '.dis' ||
                ext === '.1st' || ext === '.now' || ext === '.j_' || ext === '.meg' ||
                ext === '.nta' || ext === '.604' || ext === '.cip' || ext === '.dod' ||
                ext === '.edg' || ext === '.eod' || ext === '.evl' || ext === '.inf' ||
                ext === '.nex' || ext === '.pil' || ext === '.thg' || ext === '.!!!') {

                const relativePath = path.relative('ascii', filePath).replace(/\\/g, '/');
                const fileName = path.basename(file);

                asciiFiles.push({
                    name: fileName,
                    path: relativePath,
                    fullPath: filePath.replace(/\\/g, '/'),
                    size: stat.size
                });
            }
        }
    });

    return asciiFiles.sort((a, b) => a.name.localeCompare(b.name));
}

// Rota para listar todas as fontes
app.get('/api/fonts', (req, res) => {
    try {
        const fontFiles = findFontFiles('fonts');
        res.json(fontFiles);
    } catch (error) {
        console.error('Erro ao buscar fontes:', error);
        res.status(500).json({ error: 'Erro ao buscar fontes' });
    }
});

// Rota para listar todos os arquivos ASCII
app.get('/api/ascii', (req, res) => {
    try {
        const asciiFiles = findAsciiFiles('ascii');
        res.json(asciiFiles);
    } catch (error) {
        console.error('Erro ao buscar arquivos ASCII:', error);
        res.status(500).json({ error: 'Erro ao buscar arquivos ASCII' });
    }
});

// Rota para ler conteúdo de um arquivo ASCII específico
app.get('/api/ascii/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const asciiFiles = findAsciiFiles('ascii');
        const file = asciiFiles.find(f => f.name === filename);

        if (!file) {
            return res.status(404).json({ error: 'Arquivo não encontrado' });
        }

        // Tentar diferentes codificações para arquivos ASCII antigos
        let content;
        const filePath = path.join('ascii', file.path);

        try {
            // Ler arquivo como buffer
            const buffer = fs.readFileSync(filePath);
            const ext = path.extname(file.name).toLowerCase();

            // Lista de codificações para tentar, em ordem de prioridade
            const encodingsToTry = [];

            if (ext === '.nfo' || ext === '.diz' || ext === '.ans' || ext === '.asc') {
                // Arquivos típicos de BBS - priorizar CP437 e variantes
                encodingsToTry.push('cp437', 'cp850', 'cp852', 'latin1', 'utf8');
            } else {
                // Outros arquivos - priorizar UTF-8 e ISO
                encodingsToTry.push('utf8', 'latin1', 'cp437', 'cp1252');
            }

            let bestContent = null;
            let bestScore = -1;

            for (const encoding of encodingsToTry) {
                try {
                    let testContent;
                    if (iconv.encodingExists(encoding)) {
                        testContent = iconv.decode(buffer, encoding);
                    } else {
                        testContent = buffer.toString(encoding);
                    }

                    // Calcular "score" baseado na qualidade da decodificação
                    const replacementChars = (testContent.match(/�/g) || []).length;
                    const totalChars = testContent.length;
                    const score = totalChars > 0 ? (totalChars - replacementChars) / totalChars : 0;

                    if (score > bestScore) {
                        bestScore = score;
                        bestContent = testContent;
                    }

                    // Se conseguiu decodificar sem caracteres de substituição, usar este
                    if (replacementChars === 0) {
                        content = testContent;
                        break;
                    }
                } catch (e) {
                    // Continuar tentando outras codificações
                    continue;
                }
            }

            // Se não encontrou uma codificação perfeita, usar a melhor encontrada
            if (!content && bestContent) {
                content = bestContent;
            }

        } catch (readError) {
            console.error('Erro ao ler arquivo:', readError);
        }

        // Fallback final
        if (!content) {
            try {
                content = fs.readFileSync(filePath, 'utf8');
            } catch (e) {
                content = fs.readFileSync(filePath, 'latin1');
            }
        }

        res.json({
            filename: file.name,
            path: file.path,
            content: content,
            size: file.size,
            encoding: 'auto-detected'
        });
    } catch (error) {
        console.error('Erro ao ler arquivo ASCII:', error);
        res.status(500).json({ error: 'Erro ao ler arquivo ASCII' });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Buscando recursos disponíveis...');

    try {
        const fontFiles = findFontFiles('fonts');
        console.log(`${fontFiles.length} fontes encontradas:`);
        fontFiles.slice(0, 5).forEach(font => {
            console.log(`- ${font.name}`);
        });
        if (fontFiles.length > 5) {
            console.log(`... e mais ${fontFiles.length - 5} fontes`);
        }

        const asciiFiles = findAsciiFiles('ascii');
        console.log(`\n${asciiFiles.length} arquivos ASCII encontrados:`);
        asciiFiles.slice(0, 10).forEach(file => {
            console.log(`- ${file.name} (${file.size} bytes)`);
        });
        if (asciiFiles.length > 10) {
            console.log(`... e mais ${asciiFiles.length - 10} arquivos ASCII`);
        }
    } catch (error) {
        console.error('Erro ao listar recursos:', error);
    }
});
