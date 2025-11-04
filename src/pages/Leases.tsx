import { useEffect, useState } from 'react';
import { leasesAPI } from '../services/api';
import type { Lease } from '../types';
import { Plus, FileText, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function Leases() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeases();
  }, []);

  const loadLeases = async () => {
    try {
      const data = await leasesAPI.getAll();
      setLeases(data);
    } catch (error) {
      console.error('Failed to load leases:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Leases</h1>
          <p className="mt-1 text-sm text-gray-500">Manage lease agreements</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Lease
        </button>
      </div>

      {leases.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No leases</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new lease.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {leases.map((lease) => (
            <div key={lease.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Lease #{lease.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500">Property {lease.propertyId}</p>
                </div>
                <span className={`badge ${
                  lease.status === 'active' ? 'badge-success' :
                  lease.status === 'expired' ? 'badge-warning' :
                  'badge-danger'
                }`}>
                  {lease.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Start Date
                  </span>
                  <span className="font-medium">{format(new Date(lease.startDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    End Date
                  </span>
                  <span className="font-medium">{format(new Date(lease.endDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Monthly Rent
                  </span>
                  <span className="font-medium">${lease.monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Deposit</span>
                  <span className="font-medium">${lease.deposit.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <button className="text-sm text-primary-600 hover:text-primary-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

