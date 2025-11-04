import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../services/api';
import type { Property } from '../types';
import { Plus, Building2, MapPin, DollarSign } from 'lucide-react';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertiesAPI.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { className: string; label: string }> = {
      available: { className: 'badge-success', label: 'Available' },
      occupied: { className: 'badge-info', label: 'Occupied' },
      maintenance: { className: 'badge-warning', label: 'Maintenance' },
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
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your property portfolio</p>
        </div>
        <Link
          to="/properties/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="card text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new property.</p>
          <div className="mt-6">
            <Link to="/properties/new" className="btn btn-primary">
              Add Property
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const statusBadge = getStatusBadge(property.status);
            return (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.city}, {property.state}
                    </div>
                  </div>
                  <span className={`badge ${statusBadge.className}`}>{statusBadge.label}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="font-medium capitalize">{property.type}</span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Bedrooms</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rent</span>
                    <span className="font-medium flex items-center">
                      <DollarSign className="h-4 w-4" />
                      {property.rentAmount.toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

