import { Candidate, JobRequisition, Department, InterviewRound, InterviewStageConfig, AppUser } from '../types';

export type DbSyncStatus = 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' | 'LOCAL_FALLBACK';

export interface DbHealthResult {
  isConnected: boolean;
  database?: string;
  message: string;
  tablesCount?: number;
  serverTime?: string;
  error?: string;
}

const API_BASE = '/api';

export class DbService {
  private static status: DbSyncStatus = 'CONNECTING';

  public static getStatus(): DbSyncStatus {
    return this.status;
  }

  /**
   * Health check for MySQL Connection
   */
  public static async checkHealth(): Promise<DbHealthResult> {
    try {
      const response = await fetch(`${API_BASE}/health.php`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        this.status = 'DISCONNECTED';
        return {
          isConnected: false,
          message: `خطای سرور: ${response.status} ${response.statusText}`,
        };
      }

      const res = await response.json();
      if (res.status === 'connected' && res.data?.is_connected) {
        this.status = 'CONNECTED';
        return {
          isConnected: true,
          database: res.data.database,
          tablesCount: res.data.tables_count,
          serverTime: res.data.server_time,
          message: 'اتصال به دیتابیس MySQL هاست با موفقیت برقرار است.',
        };
      } else {
        this.status = 'DISCONNECTED';
        return {
          isConnected: false,
          database: res.data?.database,
          message: res.message || 'عدم اتصال به دیتابیس MySQL',
          error: res.data?.hint,
        };
      }
    } catch (err: any) {
      this.status = 'LOCAL_FALLBACK';
      return {
        isConnected: false,
        message: 'عدم برقراری ارتباط با وب‌سرویس PHP دیتابیس. سامانه در حالت حافظه آفلاین قرار دارد.',
        error: err?.message,
      };
    }
  }

  /**
   * Run 1-Click Auto Setup
   */
  public static async runAutoSetup(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE}/setup.php`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      const res = await response.json();
      return {
        success: res.status === 'success',
        message: res.message || (res.status === 'success' ? 'پایگاه داده نصب شد.' : 'خطا در نصب دیتابیس.'),
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'خطا در برقراری ارتباط با اسکریپت راه‌اندازی.',
      };
    }
  }

  /**
   * Fetch live data from MySQL
   */
  public static async fetchAllData(): Promise<{
    success: boolean;
    data?: {
      candidates: Candidate[];
      requisitions: JobRequisition[];
      departments: Department[];
      interviews: InterviewRound[];
      interviewStages: InterviewStageConfig[];
      users: AppUser[];
    };
    dbStatus: DbSyncStatus;
  }> {
    try {
      const response = await fetch(`${API_BASE}/sync.php`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        this.status = 'LOCAL_FALLBACK';
        return { success: false, dbStatus: 'LOCAL_FALLBACK' };
      }

      const res = await response.json();
      if (res.status === 'success' && res.data) {
        this.status = 'CONNECTED';
        return {
          success: true,
          data: res.data,
          dbStatus: 'CONNECTED',
        };
      } else {
        this.status = 'LOCAL_FALLBACK';
        return { success: false, dbStatus: 'LOCAL_FALLBACK' };
      }
    } catch {
      this.status = 'LOCAL_FALLBACK';
      return { success: false, dbStatus: 'LOCAL_FALLBACK' };
    }
  }

  /**
   * Seed all initial data into MySQL if empty
   */
  public static async seedAllToMysql(allData: {
    candidates: Candidate[];
    requisitions: JobRequisition[];
    departments: Department[];
    interviews: InterviewRound[];
    interviewStages: InterviewStageConfig[];
  }): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/sync.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SEED_ALL', data: allData }),
      });
      const res = await response.json();
      return res.status === 'success';
    } catch {
      return false;
    }
  }

  /**
   * Real-time Async Persistence Actions
   */
  public static async saveCandidate(candidate: Candidate) {
    this.sendAction('SAVE_CANDIDATE', candidate);
  }

  public static async saveCandidatesBulk(candidates: Candidate[]) {
    this.sendAction('SAVE_CANDIDATES_BULK', { candidates });
  }

  public static async deleteCandidate(id: string) {
    this.sendAction('DELETE_CANDIDATE', { id });
  }

  public static async saveRequisition(requisition: JobRequisition) {
    this.sendAction('SAVE_REQUISITION', requisition);
  }

  public static async saveDepartment(department: Department) {
    this.sendAction('SAVE_DEPARTMENT', department);
  }

  public static async deleteDepartment(id: string) {
    this.sendAction('DELETE_DEPARTMENT', { id });
  }

  public static async saveInterview(interview: InterviewRound) {
    this.sendAction('SAVE_INTERVIEW', interview);
  }

  public static async saveStage(stage: InterviewStageConfig) {
    this.sendAction('SAVE_STAGE', stage);
  }

  public static async deleteStage(id: string) {
    this.sendAction('DELETE_STAGE', { id });
  }

  public static async saveUser(user: AppUser) {
    this.sendAction('SAVE_USER', user);
  }

  public static async deleteUser(id: string) {
    this.sendAction('DELETE_USER', { id });
  }

  private static async sendAction(action: string, data: any) {
    try {
      await fetch(`${API_BASE}/sync.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      });
    } catch (e) {
      console.warn('MySQL Sync async call failed, saved locally:', e);
    }
  }
}
