'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Modal from '@/components/shared/Modal';
import Input from '@/components/shared/Input';
import Calendar from '@/components/shared/Calendar';
import DatePicker from '@/components/shared/DatePicker';
import Select from '@/components/shared/Select';
import { Plus, Calendar as CalendarIcon, Trash2, Pencil, CheckCircle2, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { useNavbarActions } from '@/components/shared/NavbarActionsContext';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

export default function HolidaysPage() {
  const { setActions } = useNavbarActions();
  const [holidays, setHolidays] = useState([]);
  const [weekendConfig, setWeekendConfig] = useState({ weekendDays: [0, 6] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'holiday',
    isRecurring: false,
    description: ''
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, holidayId: null, onConfirm: null, loading: false, error: '' });

  useEffect(() => {
    fetchData();
  }, [currentYear]);

  useEffect(() => {
    setActions(
      <Button
        variant="outline"
        onClick={() => {
          setEditingHoliday(null);
          setFormData({ name: '', date: '', type: 'holiday', isRecurring: false, description: '' });
          setShowModal(true);
        }}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Holiday
      </Button>
    );
    return () => setActions(null);
  }, [setActions]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [holidaysRes, weekendRes] = await Promise.all([
        fetch(`/app/api/admin/holidays?year=${currentYear}`),
        fetch('/app/api/admin/weekend')
      ]);

      const [holidaysData, weekendData] = await Promise.all([
        holidaysRes.json(),
        weekendRes.json()
      ]);

      if (holidaysData.success) {
        setHolidays(holidaysData.holidays || []);
      } else {
        setError(holidaysData.error || 'Failed to fetch holidays');
      }
      if (weekendData.success) {
        setWeekendConfig(weekendData.config);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const url = editingHoliday 
        ? `/app/api/admin/holidays/${editingHoliday._id}`
        : '/app/api/admin/holidays';
      const method = editingHoliday ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(editingHoliday ? 'Holiday updated successfully!' : 'Holiday created successfully!');
        await fetchData();
        setShowModal(false);
        setEditingHoliday(null);
        setFormData({ name: '', date: '', type: 'holiday', isRecurring: false, description: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save holiday');
      }
    } catch (error) {
      console.error('Error saving holiday:', error);
      setError('An error occurred while saving holiday. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (holiday) => {
    setConfirmationModal({
      isOpen: true,
      holidayId: holiday._id,
      loading: false,
      error: '',
      onConfirm: async () => {
        setConfirmationModal(prev => ({ ...prev, loading: true, error: '' }));
        try {
          const res = await fetch(`/app/api/admin/holidays/${holiday._id}`, {
            method: 'DELETE'
          });

          const data = await res.json();
          if (data.success) {
            setSuccess('Holiday deleted successfully!');
            await fetchData();
            setConfirmationModal({ isOpen: false, holidayId: null, onConfirm: null, loading: false, error: '' });
            setTimeout(() => setSuccess(''), 3000);
          } else {
            setConfirmationModal(prev => ({ ...prev, loading: false, error: data.error || 'Failed to delete holiday' }));
          }
        } catch (error) {
          console.error('Error deleting holiday:', error);
          setConfirmationModal(prev => ({ ...prev, loading: false, error: 'Failed to delete holiday. Please try again.' }));
        }
      }
    });
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: format(new Date(holiday.date), 'yyyy-MM-dd'),
      type: holiday.type,
      isRecurring: holiday.isRecurring || false,
      description: holiday.description || ''
    });
    setShowModal(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      date: format(date, 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E39A2E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && !showModal && (
        <Alert type="error" message={error} onDismiss={() => setError('')} />
      )}
      {success && (
        <Alert type="success" message={success} onDismiss={() => setSuccess('')} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Calendar
          holidays={holidays}
          leaves={[]}
          onDateClick={handleDateClick}
          selectedDate={selectedDate}
          weekendDays={weekendConfig.weekendDays || [0, 6]}
        />

        {/* Holidays List */}
        <Card>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Holidays</h2>
            <Select
              value={currentYear.toString()}
              onChange={(value) => setCurrentYear(parseInt(value))}
              options={Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return { value: year.toString(), label: year.toString(), icon: CalendarIcon };
              })}
              placeholder="Select year"
              icon={CalendarIcon}
            />
          </div>

          {holidays.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No holidays configured</p>
            </div>
          ) : (
            <div className="space-y-3">
              {holidays.map((holiday) => (
                <div
                  key={holiday._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-[#E39A2E]/30 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{holiday.name}</h3>
                      {holiday.isRecurring && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          Recurring
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {format(new Date(holiday.date), 'MMM d, yyyy')}
                    </p>
                    {holiday.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{holiday.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(holiday)}
                      className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                      title="Edit holiday"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(holiday)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                      title="Delete holiday"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingHoliday(null);
          setFormData({ name: '', date: '', type: 'holiday', isRecurring: false, description: '' });
          setError('');
        }}
        title={editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert type="error" message={error} onDismiss={() => setError('')} />
          )}
          <Input
            label="Holiday Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Christmas Day, New Year's Day"
            required
          />
          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(value) => setFormData({ ...formData, date: value })}
            placeholder="Select a date"
            required
          />
          <Select
            label="Type"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
            options={[
              { value: 'holiday', label: 'Holiday', icon: Flag },
              { value: 'weekend', label: 'Weekend', icon: CalendarIcon }
            ]}
            placeholder="Select type"
            icon={Flag}
          />
          <Input
            label="Description"
            as="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter a brief description about this holiday (optional)"
            rows={3}
          />
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <label htmlFor="isRecurring" className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
              Recurring (applies every year)
            </label>
            <div className="relative">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="sr-only"
              />
              <div
                onClick={() => setFormData({ ...formData, isRecurring: !formData.isRecurring })}
                className={`
                  w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer flex items-center justify-center
                  ${formData.isRecurring 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'bg-transparent border-slate-300 dark:border-slate-600'
                  }
                `}
              >
                {formData.isRecurring && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setShowModal(false);
                setEditingHoliday(null);
                setFormData({ name: '', date: '', type: 'holiday', isRecurring: false, description: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting} loading={submitting}>
              {editingHoliday ? 'Update' : 'Add'} Holiday
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, holidayId: null, onConfirm: null, loading: false, error: '' })}
        onConfirm={confirmationModal.onConfirm}
        title="Delete Holiday"
        message={
          confirmationModal.error
            ? <span className="text-red-600 dark:text-red-400">{confirmationModal.error}</span>
            : "Are you sure you want to delete this holiday? This action cannot be undone."
        }
        confirmText="Delete"
        variant="danger"
        icon={Trash2}
        loading={confirmationModal.loading}
      />
    </div>
  );
}
