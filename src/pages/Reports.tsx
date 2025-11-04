import { useEffect, useState } from 'react';
import { reportsAPI, propertiesAPI } from '../services/api';
import type { FinancialReport, Property } from '../types';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

export default function Reports() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [period, setPeriod] = useState<string>('month');
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty && selectedProperty !== 'all') {
      loadReport();
    }
  }, [selectedProperty, period]);

  const loadProperties = async () => {
    try {
      const data = await propertiesAPI.getAll();
      setProperties(data);
      if (data.length > 0) {
        setSelectedProperty(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReport = async () => {
    try {
      if (user?.role === 'property_owner') {
        const data = await reportsAPI.getOwnerReport(user.id, period);
        setReport(data);
      } else if (selectedProperty !== 'all') {
        const data = await reportsAPI.getPropertyReport(selectedProperty, period);
        setReport(data);
      }
    } catch (error) {
      console.error('Failed to load report:', error);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="mt-1 text-sm text-gray-500">View financial performance and analytics</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {user?.role === 'property_manager' && (
            <div>
              <label className="label">Property</label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="input"
              >
                <option value="all">All Properties</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="label">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input"
            >
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {report ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Summary Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${report.totalIncome.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${report.totalExpenses.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Net Income</dt>
                    <dd className={`text-lg font-medium ${
                      report.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${report.netIncome.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="lg:col-span-2 card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Maintenance</span>
                <span className="font-medium">${report.expenses.maintenance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Utilities</span>
                <span className="font-medium">${report.expenses.utilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Taxes</span>
                <span className="font-medium">${report.expenses.taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Insurance</span>
                <span className="font-medium">${report.expenses.insurance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Other</span>
                <span className="font-medium">${report.expenses.other.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Rent Collected</p>
                <p className="text-lg font-semibold">${report.rentCollected.toLocaleString()}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500">Generated</p>
                <p className="text-sm text-gray-700">
                  {format(new Date(report.generatedDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No report available</h3>
          <p className="mt-1 text-sm text-gray-500">Select a property and period to generate a report.</p>
        </div>
      )}
    </div>
  );
}

