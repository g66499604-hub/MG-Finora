import { isSupabaseConfigured, supabase } from './supabaseClient';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  userId?: string;
}

const AUDIT_STORAGE_KEY = 'mg_finora_audit_logs';

export const AuditLogger = {
  getLogs(): AuditLogEntry[] {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse audit logs', e);
    }
    return [
      {
        id: 'audit_init',
        timestamp: Date.now() - 3600000,
        action: 'SYSTEM_BOOT',
        entityType: 'System',
        details: 'MG-Finora initialized with enterprise security layers'
      }
    ];
  },

  log(action: string, entityType: string, details: string, entityId?: string, userId?: string): void {
    const entry: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      action,
      entityType,
      entityId,
      details,
      userId
    };

    // Save to local vault
    const existing = this.getLogs();
    const updated = [entry, ...existing.slice(0, 199)]; // Keep latest 200 logs
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));

    // Async push to Supabase if live
    if (isSupabaseConfigured() && supabase) {
      (async () => {
        try {
          await supabase
            .from('audit_logs')
            .insert({
              action,
              entity_type: entityType,
              entity_id: entityId,
              metadata: { details },
              user_id: userId
            });
        } catch (err: unknown) {
          console.warn('Supabase audit log push error:', err);
        }
      })();
    }
  },

  clearLogs(): void {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }
};
