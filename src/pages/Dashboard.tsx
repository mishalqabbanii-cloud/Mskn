import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { propertiesAPI, paymentsAPI, maintenanceAPI } from '../services/api';
import type { Property, Payment, MaintenanceRequest } from '../types';
import {
  Building2,
  CreditCard,
  Wrench,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    properties: 0,
    payments: 0,
    maintenance: 0,
    revenue: 0,
  });
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [recentMaintenance, setRecentMaintenance] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [properties, payments, maintenance] = await Promise.all([
          propertiesAPI.getAll().catch(() => []),
          paymentsAPI.getAll().catch(() => []),
          maintenanceAPI.getAll().catch(() => []),
        ]);

        const userPayments = user?.role === 'tenant'
          ? payments.filter((p: Payment) => p.tenantId === user.id)
          : payments;

        const userMaintenance = user?.role === 'tenant'
          ? maintenance.filter((m: MaintenanceRequest) => m.tenantId === user.id)
          : maintenance;

        const revenue = userPayments
          .filter((p: Payment) => p.status === 'paid')
          .reduce((sum: number, p: Payment) => sum + p.amount, 0);

        setStats({
          properties: properties.length,
          payments: userPayments.length,
          maintenance: userMaintenance.length,
          revenue,
        });

        setRecentPayments(userPayments.slice(0, 5));
        setRecentMaintenance(userMaintenance.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { className: string; label: string }> = {
      paid: { className: 'badge-success', label: 'Paid' },
      pending: { className: 'badge-warning', label: 'Pending' },
      overdue: { className: 'badge-danger', label: 'Overdue' },
      completed: { className: 'badge-success', label: 'Completed' },
      in_progress: { className: 'badge-info', label: 'In Progress' },
    };
    return badges[status] || { className: 'badge', label: status };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name}! Here's your overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Properties</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.properties}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Payments</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.payments}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Maintenance</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.maintenance}</dd>
              </dl>
            </div>
          </div>
        </div>

        {(user?.role === 'property_manager' || user?.role === 'property_owner') && (
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${stats.revenue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Payments */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
            <Link
              to="/payments"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-sm text-gray-500">No payments found</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => {
                const badge = getStatusBadge(payment.status);
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        ${payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className={`badge ${badge.className}`}>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Maintenance */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Maintenance</h2>
            <Link
              to="/maintenance"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
          {recentMaintenance.length === 0 ? (
            <p className="text-sm text-gray-500">No maintenance requests found</p>
          ) : (
            <div className="space-y-3">
              {recentMaintenance.map((request) => {
                const badge = getStatusBadge(request.status);
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{request.category}</p>
                    </div>
                    <span className={`badge ${badge.className}`}>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

