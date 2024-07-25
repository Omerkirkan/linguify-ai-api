const express = require('express');
const cors = require('cors'); // cors paketini import edin
const app = express();
const port = 3000;
const { Ollama } = require('ollama');

// JSON body parser
app.use(express.json());

// CORS middleware'ini ekleyin
app.use(cors({
    origin: '*', // İzin verilen domainleri belirleyin
    methods: 'GET, POST, PUT, DELETE', // İzin verilen HTTP metodları
    allowedHeaders: 'Content-Type, Authorization' // İzin verilen başlıklar
}));

const ollama = new Ollama();

// Örnek bir GET endpoint
app.get('/api/ok', (req, res) => {
    res.json({ status: 'OK' });
});

// Örnek bir POST endpoint
app.post('/api/chat', async (req, res) => {
    try {

        const chatContent = req.body;

        const response = await ollama.chat({ model: 'llama3', messages: chatContent, stream: true })
        for await (const part of response) {
            res.write(part.message.content);
        }

        res.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
