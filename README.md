# Registro de Citas Médicas

Prototipo académico del caso de uso 5. La primera etapa incluye la pantalla inicial de recepción, el esquema de SQLite y los repositorios de pacientes, médicos, agenda y citas. El flujo de búsqueda y reserva desde la pantalla se construye en los siguientes hitos.

## Arranque local

Se requiere Node.js 24. Con nvm, `nvm use` selecciona la versión fijada en `.nvmrc`.

```sh
npm ci
npm run db:migrate
npm run db:seed
npm test
npm start
```

La pantalla abre en [http://127.0.0.1:3000](http://127.0.0.1:3000). Puedes elegir otro puerto con `PORT`. La base de datos se guarda en `data/recepcion.sqlite`. Si necesitas otra ubicación, usa `RCM_DB_PATH` en los comandos de datos.

Los NSS ficticios incluidos son `00000000001` y `00000000002`. La carga genera horarios futuros dentro de los próximos 14 días y se puede ejecutar de nuevo para preparar otra demostración.

## Plan y seguimiento

- [Plan del proyecto](PLAN.md)
- [Estado compartido para Codex y Claude](docs/ia/ESTADO.md)
- [Bitácora de implementación y evidencias](docs/bitacora-ia.md)
