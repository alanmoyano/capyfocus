# Capyfocus

Nuestro hermoso trabajo para el seminario integrador

## Instalación y validación

Usamos npm y su lockfile para instalaciones reproducibles. La validación de estas correcciones se ejecutó con Node.js 24 y npm 11.

```sh
npm ci --no-audit --no-fund
npm run dev
```

Antes de pushear, ejecutar `npm run prePush`. Este comando comprueba formato y tipos sin reescribir el source; falla si cualquiera de los dos checks falla.

```sh
npm run check        # TypeScript, propaga el código de salida del compilador
npm run build        # TypeScript y bundle de producción
npm run lint         # ESLint, puede reportar deuda existente
npm test             # Regresiones locales, sin conexión a Supabase
npm run format:check # Prettier sin modificar archivos
npm run format       # Reescribe el formato de todo src, solo por elección explícita
```

El lockfile de Bun se conserva como artefacto histórico. El workflow documentado usa npm; no alternar package managers para actualizar dependencias. Los checks pueden detectar deuda previa de lint o formato: corregirla en cambios separados, sin reformatear todo el proyecto para validar un arreglo.

### Estado de validación de estas correcciones

La instalación limpia con `npm ci --ignore-scripts --no-audit --no-fund` y con `npm ci --no-audit --no-fund` completó correctamente. La reparación agrega 26 entradas opcionales de SWC y Rollup y conserva todas las entradas y versiones previamente resueltas.

`npm run check`, `npm run build` y las pruebas locales pasan. Las pruebas de auth usan Supabase y hooks simulados: cubren éxito diferido, errores devueltos, rejection, reintentos, envíos simultáneos y el payload de registro sin logs sensibles. Las pruebas de scripts ejecutan los scripts reales en un directorio temporal con herramientas simuladas para comprobar los códigos de salida.

`npm run lint` reporta 28 errores y 74 warnings, los mismos que el commit inicial `05aa839`. `npm run prePush` falla por dos archivos con formato pendiente, también presentes en ese commit. Los tres formularios modificados pasan lint y Prettier. El build advierte sobre datos antiguos de Browserslist. No se reformateó el source completo ni se actualizaron dependencias para resolver esa deuda.

No se realizaron pruebas de auth contra Supabase remoto ni recorridos de browser. Queda pendiente comprobar el flujo con una cuenta de prueba en un entorno autorizado.

## Cómo funcionan los secretos? 
[Documentación](https://vitejs.dev/guide/env-and-mode.html)

> [!Tip]
> **Resumen:** crear un archivo `.env.local` en la raíz con el nombre VITE_EL_NOMBRE_DEL_SECRETO=valor. 
> Para acceder a los secretos en el código: `import.meta.env.VITE_EL_NOMBRE_DEL_SECRETO`

> [!Important]
> Este archivo está ignorado por git y NUNCA tienen que pegar secretos en el código
 
> [!Tip]
> Recomendación: cada vez que agreguen un secreto, metanlo en el archivo `.env` (el cuál SI se pushea) para que los demás sepan que existe y los valores en sí, mandenlos por whatsapp, ponganlos en Notion o lo que sea. 

> [!Important]
> También: las variables solo funcionan en local, por lo que para anden en la página en internet hablar a Alan para que las cargue en Vercel

## Configuración del build remoto

La configuración versionada fija el preset Vite, `npm ci --no-audit --no-fund`, `npm run build` y la salida `dist`. Así el build remoto usa el mismo lockfile y comandos que la validación local, incluso mientras se conserva el lockfile histórico de Bun. La configuración sigue el [contrato oficial de Vercel](https://vercel.com/docs/project-configuration).

El check de la PR #54 sobre `4e0eb8b` completó la instalación con Bun y falló después con `No Next.js version detected`. No era un fallo del lockfile npm reparado: faltaba fijar el framework correcto en el build remoto. Esta configuración corrige ese preset y elimina la elección implícita de Bun.

Para integrar los demás grupos, incorporar primero el commit de tooling `f559b94` y la corrección del build remoto de esta PR. No duplicar lockfiles ni modificar dependencias en las otras branches para resolver el mismo bloqueo. Los checks de commits anteriores siguen mostrando el resultado que obtuvieron; no demuestran el resultado del código integrado. El build local no reemplaza la confirmación del check remoto.

## Despliegues

- [Producción](https://capyfocus.vercel.app/)
- [Preview](https://capyfocus-preview.vercel.app/)

## Dev tools

- [Paleta](https://www.realtimecolors.com/?colors=160c02-f6f2ee-fecc8b-c1e1c1-bce0e6&fonts=Inter-Inter)
- [Componentes](https://ui.shadcn.com/docs/components)
- [Iconos](https://lucide.dev/icons/)
