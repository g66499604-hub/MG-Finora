export type SupportedLanguage = 'en' | 'ur' | 'hi' | 'ar' | 'es' | 'zh-CN' | 'fr' | 'bn';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
  locale: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧', locale: 'en-US' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', flag: '🇵🇰', locale: 'ur-PK' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', flag: '🇮🇳', locale: 'hi-IN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦', locale: 'ar-SA' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸', locale: 'es-ES' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', dir: 'ltr', flag: '🇨🇳', locale: 'zh-CN' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷', locale: 'fr-FR' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', flag: '🇧🇩', locale: 'bn-BD' },
];

export interface TranslationDictionary {
  // Navigation & Screens
  nav_dashboard: string;
  nav_transactions: string;
  nav_income: string;
  nav_expenses: string;
  nav_budgets: string;
  nav_savings: string;
  nav_accounts: string;
  nav_credit_cards: string;
  nav_credit_debit: string;
  nav_loans: string;
  nav_bills: string;
  nav_categories: string;
  nav_reports: string;
  nav_calendar: string;
  nav_admin: string;
  nav_settings: string;
  nav_about: string;

  // Actions
  action_add_transaction: string;
  action_quick_add: string;
  action_save: string;
  action_cancel: string;
  action_delete: string;
  action_edit: string;
  action_export_csv: string;
  action_backup_json: string;
  action_restore_backup: string;
  action_clear_all: string;
  action_transfer: string;
  action_filter: string;
  action_search: string;
  action_view_all: string;
  action_pay_bill: string;
  action_contribute: string;
  action_repay_loan: string;
  action_sign_in: string;
  action_sign_up: string;
  action_sign_out: string;
  action_reset_password: string;

  // Financial Metrics
  metric_total_balance: string;
  metric_total_income: string;
  metric_total_expenses: string;
  metric_net_cash_flow: string;
  metric_total_savings: string;
  metric_credit_due: string;
  metric_available_credit: string;
  metric_money_lent: string;
  metric_money_borrowed: string;
  metric_budget_spent: string;
  metric_budget_remaining: string;

  // Common Labels
  label_amount: string;
  label_currency: string;
  label_type: string;
  label_category: string;
  label_account: string;
  label_to_account: string;
  label_date: string;
  label_title: string;
  label_description: string;
  label_notes: string;
  label_merchant: string;
  label_payment_method: string;
  label_status: string;
  label_all: string;
  label_this_month: string;
  label_last_30_days: string;
  label_this_year: string;
  label_recent_transactions: string;
  label_spending_breakdown: string;
  label_no_transactions: string;
  label_no_budgets: string;
  label_no_goals: string;
  label_no_accounts: string;

  // Admin & Branding
  admin_title: string;
  admin_owner_badge: string;
  admin_founder_title: string;
  admin_company_title: string;
  admin_backend_status: string;
  admin_supabase_connected: string;
  admin_local_vault: string;
  admin_audit_logs: string;
  admin_system_metrics: string;
  branding_developed_by: string;
  branding_company_attribution: string;
  rights_reserved: string;

  // Modals & Feedback
  modal_confirm_delete: string;
  modal_confirm_delete_msg: string;
  msg_saved_success: string;
  msg_deleted_success: string;
  msg_welcome_onboarding: string;
  msg_onboarding_sub: string;
}
