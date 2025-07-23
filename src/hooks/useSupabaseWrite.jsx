//  custom hook for writing data to supabase!!
//  insert, update, or delete data in a supabase db table :)

import { useState } from 'react';
import { supabase } from '../supabaseClient';

export function useSupabaseWrite(tableName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //inserts data into table.

  const insertData = async (rows) => {
    setLoading(true);
    setError(null);

    try {
      //check input data
      if (!rows || (Array.isArray(rows) && rows.length === 0)) {
        throw new Error('No data provided for insertion');
      }

      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert(rows)
        .select();

      if (insertError) {
        throw insertError;
      }
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  //updates data in table.

  const updateData = async (filter, updates) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from(tableName)
        .update(updates)
        .match(filter)
        .select();

      if (updateError) {
        throw updateError;
      }
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  //deletes data from table.

  const deleteData = async (filter) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .match(filter)
        .select();

      if (deleteError) {
        throw deleteError;
      }

      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { insertData, updateData, deleteData, loading, error };
}
