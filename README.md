# 🛍️ E-commerce Angular 20 - Tienda de Electrodomésticos

Aplicación e-commerce completa con Angular 20, SCSS puro y Platzi Fake Store API.

## ✨ Características

- 🔐 **Autenticación JWT** con guards e interceptors
- 📦 **CRUD completo** de productos
- 🛒 **Carrito de compras** persistente
- 🎨 **SCSS puro** sin librerías de UI
- 🏗️ **Arquitectura modular** profesional

## 🚀 Instalación
```bash
npm install
ng serve
```

## 🔑 Credenciales de Prueba

- **Email**: john@mail.com
- **Password**: changeme

## 🛣️ Rutas

- `/login` - Página de login (pública)
- `/products` - Listado de productos (protegida)
- `/products/new` - Crear producto (protegida)
- `/products/:id/edit` - Editar producto (protegida)
- `/cart` - Carrito de compras (protegida)

## 🌐 API

**Base URL**: https://api.escuelajs.co/api/v1

## 🚀 Deploy
```bash
npm run build
vercel
```

## 🛠️ Tecnologías

- Angular 20
- TypeScript 5.6
- SCSS
- RxJS