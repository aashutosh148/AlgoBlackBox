import cors from 'cors';

const corsPrefs = cors({
    origin: [
        'http://localhost:5173',
        'https://algoblackbox.netlify.app',
        'https://algoblackbox.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

export default corsPrefs;
