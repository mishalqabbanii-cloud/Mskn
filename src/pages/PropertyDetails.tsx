import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertiesAPI, tenantsAPI, leasesAPI, paymentsAPI, maintenanceAPI } from '../services/api';
import type { Property, Tenant, Lease, Payment, MaintenanceRequest } from '../types';
import { ArrowLeft, MapPin, Building2, DollarSign, Edit } from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [lease, setLease] = useState<Lease | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPropertyData();
    }
  }, [id]);

  const loadPropertyData = async () => {
    try {
      const [prop, tenantsData, leasesData, paymentsData, maintenanceData] = await Promise.all([
        propertiesAPI.getById(id!),
        tenantsAPI.getByProperty(id!).catch(() => []),
        leasesAPI.getByProperty(id!).catch(() => []),
        paymentsAPI.getByProperty(id!).catch(() => []),
        maintenanceAPI.getByProperty(id!).catch(() => []),
      ]);

      setProperty(prop);
      setTenant(tenantsData[0] || null);
      setLease(leasesData[0] || null);
      setPayments(paymentsData);
      setMaintenance(maintenanceData);
    } catch (error) {
      console.error('Failed to load property data:', error);
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

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Property not found</p>
        <Link to="/properties" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/properties"
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        <button className="btn btn-secondary flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Property Details */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium capitalize">{property.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{property.status}</p>
              </div>
              {property.bedrooms && (
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-medium">{property.bedrooms}</p>
                </div>
              )}
              {property.bathrooms && (
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-medium">{property.bathrooms}</p>
                </div>
              )}
              {property.squareFeet && (
                <div>
                  <p className="text-sm text-gray-500">Square Feet</p>
                  <p className="font-medium">{property.squareFeet.toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Monthly Rent</p>
                <p className="font-medium flex items-center">
                  <DollarSign className="h-4 w-4" />
                  {property.rentAmount.toLocaleString()}
                </p>
              </div>
            </div>
            {property.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1 text-gray-900">{property.description}</p>
              </div>
            )}
          </div>

          {/* Current Lease */}
          {lease && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Lease</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Start Date</span>
                  <span className="font-medium">{new Date(lease.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">End Date</span>
                  <span className="font-medium">{new Date(lease.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Monthly Rent</span>
                  <span className="font-medium">${lease.monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Deposit</span>
                  <span className="font-medium">${lease.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="badge badge-success">{lease.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Requests */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Maintenance Requests</h2>
              <Link to="/maintenance" className="text-sm text-primary-600 hover:text-primary-700">
                View all
              </Link>
            </div>
            {maintenance.length === 0 ? (
              <p className="text-sm text-gray-500">No maintenance requests</p>
            ) : (
              <div className="space-y-3">
                {maintenance.slice(0, 5).map((req) => (
                  <div key={req.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{req.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{req.category}</p>
                      </div>
                      <span className={`badge ${
                        req.status === 'completed' ? 'badge-success' :
                        req.status === 'in_progress' ? 'badge-info' :
                        'badge-warning'
                      }`}>
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Payments</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Maintenance Requests</p>
                <p className="text-2xl font-bold">{maintenance.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

