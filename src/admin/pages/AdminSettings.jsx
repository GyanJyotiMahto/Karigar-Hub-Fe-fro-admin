import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Settings } from 'lucide-react';
import { Toggle, PageHeader, SectionCard, SectionHeader } from '../components/AdminUI';

const inputStyle = {
  base: {
    padding: '10px 14px', borderRadius: 12, fontSize: 14,
    fontWeight: 500, color: '#1E293B', background: '#F8FAFC',
    border: '1.5px solid #E2E8F0', outline: 'none', transition: 'all 0.15s',
  },
  focus: { background: 'white', borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99,102,241,0.1)' },
  blur:  { background: '#F8FAFC', borderColor: '#E2E8F0', boxShadow: 'none' },
};

function SettingRow({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4"
      style={{ borderBottom: '1px solid #F1F5F9' }}>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {sub && <p className="text-xs mt-0.5 font-medium text-slate-400">{sub}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', width = 260 }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...inputStyle.base, ...(focused ? inputStyle.focus : inputStyle.blur), width }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

const DEFAULTS = {
  appName: 'Karigar Hub',
  supportContact: 'support@karigarhub.com',
  supportPhone: '',
  commissionPercentage: 10,
  minOrderValue: 0,
  maxOrderValue: '',
  karigarVerificationRequired: true,
  allowGuestCheckout: false,
  maintenanceMode: false,
  systemNotifications: true,
  emailNotifications: true,
  orderAlerts: true,
  newKarigarAlerts: true,
  currency: 'INR',
  language: 'en',
  timezone: 'Asia/Kolkata',
};

export default function AdminSettings() {
  const [form, setForm] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" sub="Manage platform configuration and preferences" icon={Settings} />

      {/* General Info */}
      <SectionCard>
        <SectionHeader title="General Info" sub="App name and contact details" />
        <div className="px-6">
          <SettingRow label="App Name" sub="Displayed across the platform">
            <TextInput value={form.appName} onChange={v => set('appName', v)} placeholder="Karigar Hub" />
          </SettingRow>
          <SettingRow label="Support Email" sub="Email shown to users for support">
            <TextInput value={form.supportContact} onChange={v => set('supportContact', v)} placeholder="support@karigarhub.com" />
          </SettingRow>
          <SettingRow label="Support Phone" sub="Contact number for user queries">
            <TextInput value={form.supportPhone} onChange={v => set('supportPhone', v)} placeholder="+91 00000 00000" />
          </SettingRow>
        </div>
      </SectionCard>

      {/* Localisation */}
      <SectionCard>
        <SectionHeader title="Localisation" sub="Currency, language and timezone" />
        <div className="px-6">
          <SettingRow label="Currency" sub="Used across all transactions">
            <select value={form.currency} onChange={e => set('currency', e.target.value)}
              style={{ ...inputStyle.base, width: 160 }}>
              <option value="INR">INR — ₹</option>
              <option value="USD">USD — $</option>
              <option value="EUR">EUR — €</option>
            </select>
          </SettingRow>
          <SettingRow label="Language" sub="Default platform language">
            <select value={form.language} onChange={e => set('language', e.target.value)}
              style={{ ...inputStyle.base, width: 160 }}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </SettingRow>
          <SettingRow label="Timezone" sub="Used for order timestamps">
            <select value={form.timezone} onChange={e => set('timezone', e.target.value)}
              style={{ ...inputStyle.base, width: 200 }}>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
            </select>
          </SettingRow>
        </div>
      </SectionCard>

      {/* Commission & Orders */}
      <SectionCard>
        <SectionHeader title="Commission & Orders" sub="Platform fee and order value limits" />
        <div className="px-6">
          <SettingRow label="Commission Percentage" sub="Applied to every karigar sale">
            <div className="flex items-center gap-2">
              <TextInput type="number" value={form.commissionPercentage} onChange={v => set('commissionPercentage', v)} placeholder="10" width={100} />
              <span className="text-sm font-bold text-slate-400">%</span>
            </div>
          </SettingRow>
          <SettingRow label="Minimum Order Value" sub="Orders below this value are rejected">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <TextInput type="number" value={form.minOrderValue} onChange={v => set('minOrderValue', v)} placeholder="0" width={120} />
            </div>
          </SettingRow>
          <SettingRow label="Maximum Order Value" sub="Leave blank for no limit">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <TextInput type="number" value={form.maxOrderValue} onChange={v => set('maxOrderValue', v)} placeholder="No limit" width={120} />
            </div>
          </SettingRow>
        </div>
      </SectionCard>

      {/* Platform Controls */}
      <SectionCard>
        <SectionHeader title="Platform Controls" sub="Access and verification settings" />
        <div className="px-6">
          <SettingRow label="Karigar Verification Required" sub="New karigars must be verified before listing products">
            <Toggle checked={form.karigarVerificationRequired} onChange={v => set('karigarVerificationRequired', v)} />
          </SettingRow>
          <SettingRow label="Allow Guest Checkout" sub="Let users buy without creating an account">
            <Toggle checked={form.allowGuestCheckout} onChange={v => set('allowGuestCheckout', v)} />
          </SettingRow>
          <SettingRow label="Maintenance Mode" sub="Temporarily disable the platform for users">
            <Toggle checked={form.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
          </SettingRow>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard>
        <SectionHeader title="Notifications" sub="Control alert preferences" />
        <div className="px-6">
          <SettingRow label="System Notifications" sub="In-app alerts for admin events">
            <Toggle checked={form.systemNotifications} onChange={v => set('systemNotifications', v)} />
          </SettingRow>
          <SettingRow label="Email Notifications" sub="Send email alerts for orders and registrations">
            <Toggle checked={form.emailNotifications} onChange={v => set('emailNotifications', v)} />
          </SettingRow>
          <SettingRow label="Order Alerts" sub="Notify admin on every new order">
            <Toggle checked={form.orderAlerts} onChange={v => set('orderAlerts', v)} />
          </SettingRow>
          <SettingRow label="New Karigar Alerts" sub="Notify admin when a karigar registers">
            <Toggle checked={form.newKarigarAlerts} onChange={v => set('newKarigarAlerts', v)} />
          </SettingRow>
        </div>
      </SectionCard>

      {/* Save */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
          <Save size={15} />
          Save Settings
        </motion.button>

        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
              className="text-sm font-semibold" style={{ color: '#16A34A' }}>
              ✓ Settings saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
