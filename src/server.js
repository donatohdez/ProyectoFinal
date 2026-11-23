import { createApp } from './app.js';

const host = '127.0.0.1';
const port = Number(process.env.PORT ?? 3000);

createApp().listen(port, host, function () {
  console.log(`Recepción disponible en http://${host}:${this.address().port}`);
});
