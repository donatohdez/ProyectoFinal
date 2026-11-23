import express from 'express';
import { fileURLToPath } from 'node:url';

export function createApp() {
  const app = express();
  app.set('view engine', 'ejs');
  app.set('views', fileURLToPath(new URL('./views/', import.meta.url)));
  app.use(express.static(fileURLToPath(new URL('./public/', import.meta.url))));
  app.get('/', (_request, response) => response.render('recepcion'));
  return app;
}
