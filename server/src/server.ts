import express, { Request, Response } from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import * as tls from 'tls';

const app = express();
const port = 8081;

app.use(cors());

// Load your server's certificate and private key
const options: https.ServerOptions = {
    key: fs.readFileSync('private_key.pem'),
    cert: fs.readFileSync('certificate.pem'),
    rejectUnauthorized: false, // Reject connections without a valid client cert
    maxVersion: 'TLSv1.2',
};

// Create HTTPS server with Express app
const server = https.createServer(options, app);

app.get('/health', (req: Request, res: Response) => {
    console.log('Received a health check request.');
    res.send('Hello from the server!');
});

app.get('/certificate', (req: Request, res: Response) => {
    const clientSocket = req.socket as tls.TLSSocket;

    clientSocket.renegotiate({requestCert: true, rejectUnauthorized: false}, (err) => {
        if (err) {
            console.error('Error renegotiating TLS connection:', err);
            clientSocket.end();
            return;
        }
    });

    clientSocket.on('secure', () => {
        const clientCert = clientSocket.getPeerCertificate(true);
        
        if (clientCert) {
            try {
            const base64Cert = clientCert.raw.toString('base64');
            res.send(base64Cert);
            } catch (error) {
                console.error('Error processing certificate:', error);
                res.status(500).send('Internal Server Error\n');
            }
        } else {
            console.log('No client certificate provided.');
            res.status(400).send('Bad Request: Client certificate missing\n'); 
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});