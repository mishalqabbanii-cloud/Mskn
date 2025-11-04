import { useEffect, useState } from 'react';
import { maintenanceAPI } from '../services/api';
import type { MaintenanceRequest } from '../types';
import { Plus, Wrench, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

export default function Maintenance() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await maintenanceAPI.getAll();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { className: string; icon: any }> = {
      emergency: { className: 'badge-danger', icon: AlertCircle },
      high: { className: 'badge-danger', icon: AlertCircle },
      medium: { className: 'badge-warning', icon: Clock },
      low: { className: 'badge-info', icon: Clock },
    };
    return badges[priority] || { className: 'badge', icon: Clock };
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { className: string; label: string }> = {
      completed: { className: 'badge-success', label: 'Completed' },
      in_progress: { className: 'badge-info', label: 'In Progress' },
      pending: { className: 'badge-warning', label: 'Pending' },
      cancelled: { className: 'badge-danger', label: 'Cancelled' },
    };
    return badges[status] || { className: 'badge', label: status };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="mt-1 text-sm text-gray-500">Manage maintenance and repair requests</p>
        </div>
        {user?.role === 'tenant' && (
          <button className="btn btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
          </button>
        ))}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="card text-center py-12">
          <Wrench className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No maintenance requests</h3>
          <p className="mt-1 text-sm text-gray-500">No requests match your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const priorityBadge = getPriorityBadge(request.priority);
            const statusBadge = getStatusBadge(request.status);
            const PriorityIcon = priorityBadge.icon;

            return (
              <div key={request.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{request.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`badge ${priorityBadge.className} flex items-center gap-1`}>
                      <PriorityIcon className="h-3 w-3" />
                      {request.priority}
                    </span>
                    <span className={`badge ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2 font-medium capitalize">{request.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Requested:</span>
                    <span className="ml-2 font-medium">
                      {format(new Date(request.requestedDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {request.estimatedCost && (
                    <div>
                      <span className="text-gray-500">Estimated Cost:</span>
                      <span className="ml-2 font-medium">${request.estimatedCost.toLocaleString()}</span>
                    </div>
                  )}
                  {request.completedDate && (
                    <div>
                      <span className="text-gray-500">Completed:</span>
                      <span className="ml-2 font-medium">
                        {format(new Date(request.completedDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                </div>

                {user?.role === 'property_manager' && request.status === 'pending' && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <button className="btn btn-primary text-sm">Assign</button>
                    <button className="btn btn-secondary text-sm">View Details</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

