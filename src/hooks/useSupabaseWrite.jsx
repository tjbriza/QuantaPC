//  custom hook for writing data to supabase!!
//  insert, update, or delete data in a supabase db table :)

import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useSupabaseWrite(tableName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //inserts data into table.

  const insertData = async (rows) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert(rows);

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
        .match(filter);
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
}
