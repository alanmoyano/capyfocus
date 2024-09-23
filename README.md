# Capyfocus

Nuestro hermoso trabajo para el seminario integrador

> [!Important]
> Antes de pushear: `npm run prePush`

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

## Despliegues

- [Producción](https://capyfocus.vercel.app/)
- [Preview](https://capyfocus-preview.vercel.app/)

## Dev tools

- [Paleta](https://www.realtimecolors.com/?colors=160c02-f6f2ee-fecc8b-c1e1c1-bce0e6&fonts=Inter-Inter)
- [Componentes](https://ui.shadcn.com/docs/components)
- [Iconos](https://lucide.dev/icons/)
