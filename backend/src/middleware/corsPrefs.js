import cors from 'cors'

const corsPrefs = cors({
  origin: ['*', 'http://localhost:5173'], // add your source URL here
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization']
});

export default corsPrefs;
