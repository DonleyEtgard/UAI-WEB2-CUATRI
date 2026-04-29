import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB (con manejo de errores mejorado)
const connectToMongoDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGO_URI no está definido en .env');
    console.error('💡 Crea un archivo .env con: MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/tudb');
    return;
  }
  
  // Mostrar URI (ocultando contraseña)
  const maskedUri = mongoUri.replace(/:[^:]*@/, ':********@');
  console.log(`🔗 Intentando conectar a: ${maskedUri}`);
  
  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Aumentado a 10 segundos
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Obtener información de la conexión de forma segura
    const dbName = mongoose.connection.db?.databaseName || 'No disponible';
    console.log(`📦 Base de datos: ${dbName}`);
    console.log(`📊 Estado: ${mongoose.connection.readyState === 1 ? 'Conectado 🟢' : 'Desconectado 🔴'}`);
    
  } catch (error: any) {
    console.log('\n❌ MongoDB connection FAILED:');
    console.log(`   Error: ${error.message}`);
    console.log(`   Código: ${error.code || 'N/A'}`);
    console.log(`   Nombre: ${error.name}`);
    
    // Diagnóstico de errores comunes
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔧 DIAGNÓSTICO:');
      console.log('   1. Verifica tu IP en MongoDB Atlas Network Access');
      console.log('   2. Asegúrate que el usuario/contraseña sean correctos');
      console.log('   3. Prueba con: mongodb://... en lugar de mongodb+srv://');
    }
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 DIAGNÓSTICO:');
      console.log('   1. Usuario o contraseña incorrectos');
      console.log('   2. Verifica en MongoDB Atlas → Database Access');
    }
    
    if (error.message.includes('querySrv ENOTFOUND')) {
      console.log('\n🔧 DIAGNÓSTICO:');
      console.log('   1. Problema de DNS/resolución de nombre');
      console.log('   2. Prueba con formato estándar (sin +srv)');
      console.log('   3. Verifica tu conexión a internet');
    }
    
    console.log('\n⚠️  Server will run WITHOUT database connection');
    console.log('⚠️  Las rutas GET funcionarán, pero no las operaciones de base de datos');
  }
};

// ============ RUTAS DIAGNÓSTICO MONGODB ============

// Ruta 1: Verificación básica
app.get('/api/mongo-check', (req, res) => {
  const status = mongoose.connection.readyState;
  const estados = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({
    status: status === 1 ? 'connected' : 'disconnected',
    code: status,
    estado: estados[status] || 'unknown',
    database: mongoose.connection.db?.databaseName || 'N/A',
    host: mongoose.connection.host || 'N/A',
    timestamp: new Date().toISOString(),
  });
});

// Ruta 2: Información detallada (versión segura)
app.get('/api/mongo-info', async (req, res) => {
  try {
    const status = mongoose.connection.readyState;
    
    if (status !== 1) {
      return res.json({
        connected: false,
        message: 'MongoDB no está conectado',
        state: status,
        states: {
          0: 'disconnected',
          1: 'connected', 
          2: 'connecting',
          3: 'disconnecting'
        }
      });
    }
    
    // Verificar si tenemos acceso a la base de datos
    const db = mongoose.connection.db;
    if (!db) {
      return res.json({
        connected: false,
        message: 'Conexión establecida pero no hay acceso a DB'
      });
    }
    
    // Obtener información básica de forma segura
    res.json({
      connected: true,
      database: db.databaseName || 'N/A',
      host: mongoose.connection.host || 'N/A',
      state: status,
      connectionId: mongoose.connection.id || 'N/A'
    });
    
  } catch (error: any) {
    res.status(500).json({
      connected: false,
      error: error.message,
      state: mongoose.connection.readyState
    });
  }
});

// Ruta 3: Test de operación (versión segura)
app.get('/api/mongo-test', async (req, res) => {
  try {
    const status = mongoose.connection.readyState;
    
    if (status !== 1) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB no conectado',
        state: status,
        states: {
          0: 'disconnected',
          1: 'connected', 
          2: 'connecting',
          3: 'disconnecting'
        }
      });
    }
    
    const db = mongoose.connection.db;
    if (!db) {
      return res.status(503).json({
        success: false,
        message: 'No hay acceso a la base de datos'
      });
    }
    
    // Operación de prueba SIMPLIFICADA
    const testCollection = db.collection('health_check');
    const testDoc = {
      test: 'health check',
      timestamp: new Date(),
      server: 'UAI-WEB-2025'
    };
    
    // Solo insertar y verificar (sin operaciones complejas)
    const result = await testCollection.insertOne(testDoc);
    
    res.json({
      success: true,
      message: '✅ MongoDB insert operation successful',
      operation: 'insert only',
      insertedId: result.insertedId,
      database: db.databaseName || 'N/A',
    });
    
    // Limpiar después de responder (opcional)
    setTimeout(async () => {
      try {
        await testCollection.deleteOne({ _id: result.insertedId });
      } catch (e) {
        // Ignorar errores de limpieza
      }
    }, 1000);
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'MongoDB operation failed',
      error: error.message,
      state: mongoose.connection.readyState
    });
  }
});

// ============ FIN RUTAS DIAGNÓSTICO ============

// Ruta de prueba básica
app.get('/', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  
  res.json({
    message: '🚀 Servidor UAI-WEB funcionando!',
    status: 'online',
    mongodb: mongoStatus === 1 ? 'connected' : 'disconnected',
    mongoState: mongoStatus,
    port: PORT,
    time: new Date().toISOString(),
    endpoints: {
      mongoCheck: '/api/mongo-check',
      mongoInfo: '/api/mongo-info',
      mongoTest: '/api/mongo-test',
      health: '/health',
      apiTest: '/api/test'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusCode = mongoStatus === 1 ? 200 : 503;
  
  res.status(statusCode).json({
    status: mongoStatus === 1 ? 'healthy' : 'degraded',
    database: mongoStatus === 1 ? 'connected' : 'disconnected',
    databaseState: mongoStatus,
    timestamp: new Date().toISOString(),
  });
});

// Ruta de prueba de API
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      mongoConnected: mongoose.connection.readyState === 1,
      mongoState: mongoose.connection.readyState
    },
  });
});

// Iniciar servidor
const startServer = async () => {
  console.log('🔧 Iniciando servidor...');
  console.log('📁 Directorio:', process.cwd());
  console.log('🔍 MONGO_URI definida:', !!process.env.MONGO_URI);
  
  // Conectar a MongoDB (no bloqueante)
  await connectToMongoDB();
  
  // Iniciar servidor HTTP
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`\n========================================`);
    console.log(`🚀 Servidor iniciado correctamente`);
    console.log(`📡 Local:    http://localhost:${PORT}`);
    console.log(`📡 Network:  http://${getLocalIP()}:${PORT}`);
    console.log(`📊 MongoDB:  ${mongoose.connection.readyState === 1 ? '🟢 Conectado' : '🔴 Desconectado'}`);
    console.log(`========================================`);
    
    console.log(`\n📍 Endpoints disponibles:`);
    console.log(`   GET /                 - Página principal`);
    console.log(`   GET /health           - Health check`);
    console.log(`   GET /api/test         - Test API`);
    console.log(`   GET /api/mongo-check  - Estado MongoDB`);
    console.log(`   GET /api/mongo-info   - Info detallada MongoDB`);
    console.log(`   GET /api/mongo-test   - Test operaciones MongoDB`);
    console.log(`========================================\n`);
  });
};

// Función para obtener IP local
function getLocalIP() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Manejo de errores global
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️  Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️  Uncaught Exception:', error);
});

// Iniciar aplicación
startServer();