import { Platform } from 'react-native';

let dbInstance: any = null;

export const getLocalDB = async () => {
  if (Platform.OS === 'web') {
    // Web fallback stub for Expo web bundling
    return {
      execAsync: async () => {},
      runAsync: async () => {},
      getAllAsync: async () => [],
    };
  }

  // Native SQLite implementation
  const SQLite = require('expo-sqlite');
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('sanjeevani_offline.db');
    await initTables(dbInstance);
  }
  return dbInstance;
};

const initTables = async (db: any) => {
  if (Platform.OS === 'web') return;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS local_patients (
      id TEXT PRIMARY KEY NOT NULL,
      full_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      village TEXT NOT NULL,
      mobile TEXT,
      mock_abha TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS local_vitals (
      id TEXT PRIMARY KEY NOT NULL,
      patient_id TEXT NOT NULL,
      temperature REAL,
      heart_rate INTEGER,
      blood_pressure TEXT,
      spO2 INTEGER,
      weight REAL,
      recorded_by TEXT NOT NULL,
      recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS local_symptoms (
      id TEXT PRIMARY KEY NOT NULL,
      patient_id TEXT NOT NULL,
      symptoms_json TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      description TEXT,
      recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS local_followups (
      id TEXT PRIMARY KEY NOT NULL,
      patient_id TEXT NOT NULL,
      assigned_worker_id TEXT NOT NULL,
      type TEXT NOT NULL,
      priority TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL,
      outcome TEXT,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY NOT NULL,
      client_uuid TEXT NOT NULL UNIQUE,
      entity_type TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      sync_status TEXT DEFAULT 'PENDING',
      retry_count INTEGER DEFAULT 0,
      error_message TEXT
    );
  `);
};
