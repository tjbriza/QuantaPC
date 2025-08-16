import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSupabaseRead } from '../../../hooks/useSupabaseRead';
import { useSupabaseWrite } from '../../../hooks/useSupabaseWrite';
import { Plus } from 'lucide-react';
import AddNewAddressForm from '../../ui/Dashboard/Addresses/AddNewAddressForm';
import AddressItem from '../../ui/Dashboard/Addresses/AddressItem';
import { useConfirmDialog } from '../../ui/ConfirmDialog';

// Main Addresses component
export default function Addresses() {
  const { session } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { confirm, dialog } = useConfirmDialog();

  const {
    data: addresses,
    loading,
    error,
  } = useSupabaseRead('shipping_address', {
    filter: { user_id: session?.user?.id },
    order: { column: 'is_default', ascending: false },
  });

  const {
    insertData,
    updateData,
    deleteData,
    loading: writeLoading,
  } = useSupabaseWrite('shipping_address');

  const handleAddNew = async (formData) => {
    try {
      const addressData = {
        user_id: session?.user?.id,
        ...formData,
        is_default: addresses?.length === 0,
      };

      const result = await insertData([addressData]);
      if (!result.error) {
        setIsAddingNew(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleEditSave = async (addressId, formData) => {
    try {
      const currentAddress = addresses.find((addr) => addr.id === addressId);
      const addressData = {
        ...formData,
        is_default: currentAddress.is_default,
      };

      const result = await updateData({ id: addressId }, addressData);
      if (!result.error) {
        setEditingId(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm('Are you sure you want to delete this address?');
    if (!ok) return;

    setDeletingId(id);
    try {
      const result = await deleteData({ id });
      if (!result.error) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await updateData(
        { user_id: session?.user?.id, is_default: true },
        { is_default: false }
      );
      await updateData({ id }, { is_default: true });
      window.location.reload();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>Loading addresses...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full items-center mt-4 mb-16'>
      {dialog}
      <div className='flex gap-4 items-center mb-6 w-full'>
        <h1 className='text-3xl font-bold'>My Addresses</h1>
        {!isAddingNew && (
          <button
            onClick={() => setIsAddingNew(true)}
            className='px-4 text-black text-xl rounded flex gap-2 hover:underline'
          >
            Add New Address
            <Plus className='w-6 h-6' />
          </button>
        )}
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 w-full'>
          Error loading addresses: {error.message}
        </div>
      )}

      {isAddingNew && (
        <AddNewAddressForm
          onSave={handleAddNew}
          onCancel={() => setIsAddingNew(false)}
          isLoading={writeLoading}
        />
      )}

      {addresses?.length === 0 ? (
        <div className='text-center py-8 w-full'>
          <p className='text-gray-500 mb-4'>
            No addresses found. Add your first address to get started.
          </p>
        </div>
      ) : (
        <div className='space-y-6 w-full'>
          {addresses?.map((address) => (
            <AddressItem
              key={address.id}
              address={address}
              isEditing={editingId === address.id}
              onEdit={setEditingId}
              onSave={handleEditSave}
              onCancel={() => setEditingId(null)}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
              isLoading={writeLoading}
              isDeletingThis={deletingId === address.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
