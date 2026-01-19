'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import TimePicker from '@/components/shared/TimePicker';
import Tabs from '@/components/shared/Tabs';
import Select from '@/components/shared/Select';
import { Clock, Calendar, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [config, setConfig] = useState(null);
  const [weekendConfig, setWeekendConfig] = useState({ weekendDays: [0, 6] });
  const [leaveConfig, setLeaveConfig] = useState({
    sickLeave: { limit: 0, period: 'yearly' },
    paidLeave: { limit: 0, period: 'yearly' },
    workFromHome: { limit: 0, period: 'yearly' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingWeekend, setSavingWeekend] = useState(false);
  const [savingLeave, setSavingLeave] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const [configRes, weekendRes, leaveConfigRes] = await Promise.all([
        fetch('/app/api/admin/config'),
        fetch('/app/api/admin/weekend'),
        fetch('/app/api/admin/leave-config')
      ]);

      const [configData, weekendData, leaveConfigData] = await Promise.all([
        configRes.json(),
        weekendRes.json(),
        leaveConfigRes.json()
      ]);

      if (configData.success) {
        setConfig(configData.config);
      }
      if (weekendData.success) {
        setWeekendConfig(weekendData.config);
      }
      if (leaveConfigData.success) {
        setLeaveConfig(leaveConfigData.config);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/app/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save configuration');
        setSaving(false);
        return;
      }

      setSuccess('Configuration saved successfully');
      setConfig(data.config);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
      </div>
    );
  }

  if (!config) return null;

  const handleLeaveConfigSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingLeave(true);

    try {
      const res = await fetch('/app/api/admin/leave-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveConfig)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save leave configuration');
        setSavingLeave(false);
        return;
      }

      setSuccess('Leave configuration saved successfully');
      setLeaveConfig(data.config);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('An error occurred');
    } finally {
      setSavingLeave(false);
    }
  };

  const handleWeekendSubmit = async () => {
    setSavingWeekend(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/app/api/admin/weekend', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weekendConfig)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Weekend configuration saved successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save weekend configuration');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('An error occurred');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSavingWeekend(false);
    }
  };

  const tabs = [
    {
      id: 'attendance',
      label: 'Attendance Configuration',
      icon: Clock,
      content: (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TimePicker
                label="Start Time"
                value={config.startTime?.split(':').slice(0, 2).join(':')}
                onChange={(value) => setConfig({ ...config, startTime: value + ':00' })}
                placeholder="Select start time"
                required
              />

              <TimePicker
                label="End Time"
                value={config.endTime?.split(':').slice(0, 2).join(':')}
                onChange={(value) => setConfig({ ...config, endTime: value + ':00' })}
                placeholder="Select end time"
                required
              />

              <Input
                label="Late Threshold (minutes)"
                type="number"
                value={config.lateThresholdMinutes}
                onChange={(e) => setConfig({ ...config, lateThresholdMinutes: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 15"
                min="0"
                required
              />

              <Input
                label="Early Leave Threshold (minutes)"
                type="number"
                value={config.earlyLeaveThresholdMinutes}
                onChange={(e) => setConfig({ ...config, earlyLeaveThresholdMinutes: parseInt(e.target.value) || 0 })}
                placeholder="e.g., 15"
                min="0"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Require Reason on Late</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Users must provide a reason when punching in late</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.requireReasonOnLate}
                    onChange={(e) => setConfig({ ...config, requireReasonOnLate: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#E39A2E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E39A2E]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">Require Reason on Early Leave</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Users must provide a reason when leaving early</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.requireReasonOnEarly}
                    onChange={(e) => setConfig({ ...config, requireReasonOnEarly: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#E39A2E] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E39A2E]"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" loading={saving}>
                Save Attendance Configuration
              </Button>
            </div>
          </form>
        </Card>
      )
    },
    {
      id: 'leave',
      label: 'Leave Configuration',
      icon: Calendar,
      content: (
        <div className="space-y-6">
          <Card>
            <form onSubmit={handleLeaveConfigSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Sick Leave */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Sick Leave</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Limit (days)"
                      type="number"
                      value={leaveConfig.sickLeave.limit}
                      onChange={(e) => setLeaveConfig({
                        ...leaveConfig,
                        sickLeave: { ...leaveConfig.sickLeave, limit: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="e.g., 12"
                      min="0"
                      required
                    />
                    <Select
                      label="Period"
                      value={leaveConfig.sickLeave.period}
                      onChange={(value) => setLeaveConfig({
                        ...leaveConfig,
                        sickLeave: { ...leaveConfig.sickLeave, period: value }
                      })}
                      options={[
                        { value: 'yearly', label: 'Yearly', icon: Calendar },
                        { value: 'monthly', label: 'Monthly', icon: Calendar }
                      ]}
                      placeholder="Select period"
                      icon={Calendar}
                    />
                  </div>
                </div>

                {/* Paid Leave */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Paid Leave</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Limit (days)"
                      type="number"
                      value={leaveConfig.paidLeave.limit}
                      onChange={(e) => setLeaveConfig({
                        ...leaveConfig,
                        paidLeave: { ...leaveConfig.paidLeave, limit: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="e.g., 20"
                      min="0"
                      required
                    />
                    <Select
                      label="Period"
                      value={leaveConfig.paidLeave.period}
                      onChange={(value) => setLeaveConfig({
                        ...leaveConfig,
                        paidLeave: { ...leaveConfig.paidLeave, period: value }
                      })}
                      options={[
                        { value: 'yearly', label: 'Yearly', icon: Calendar },
                        { value: 'monthly', label: 'Monthly', icon: Calendar }
                      ]}
                      placeholder="Select period"
                      icon={Calendar}
                    />
                  </div>
                </div>

                {/* Work From Home */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Work From Home</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Limit (days)"
                      type="number"
                      value={leaveConfig.workFromHome.limit}
                      onChange={(e) => setLeaveConfig({
                        ...leaveConfig,
                        workFromHome: { ...leaveConfig.workFromHome, limit: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="e.g., 8"
                      min="0"
                      required
                    />
                    <Select
                      label="Period"
                      value={leaveConfig.workFromHome.period}
                      onChange={(value) => setLeaveConfig({
                        ...leaveConfig,
                        workFromHome: { ...leaveConfig.workFromHome, period: value }
                      })}
                      options={[
                        { value: 'yearly', label: 'Yearly', icon: Calendar },
                        { value: 'monthly', label: 'Monthly', icon: Calendar }
                      ]}
                      placeholder="Select period"
                      icon={Calendar}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" loading={savingLeave}>
                  Save Leave Configuration
                </Button>
              </div>
            </form>
          </Card>

          {/* Weekend Configuration */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Weekend Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Select Weekend Days
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                    <label
                      key={index}
                      className={`
                        flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${weekendConfig.weekendDays.includes(index)
                          ? 'border-[#E39A2E] bg-[#E39A2E]/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={weekendConfig.weekendDays.includes(index)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWeekendConfig({
                              ...weekendConfig,
                              weekendDays: [...weekendConfig.weekendDays, index].sort()
                            });
                          } else {
                            setWeekendConfig({
                              ...weekendConfig,
                              weekendDays: weekendConfig.weekendDays.filter(d => d !== index)
                            });
                          }
                        }}
                        className="sr-only"
                      />
                      <span className={`text-xs font-medium ${
                        weekendConfig.weekendDays.includes(index)
                          ? 'text-[#E39A2E]'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {day.slice(0, 3)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleWeekendSubmit} loading={savingWeekend}>
                  Save Weekend Configuration
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} defaultTab="attendance" />
    </div>
  );
}
