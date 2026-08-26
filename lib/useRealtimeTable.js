'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export function useRealtimeTable(table, { orderBy = 'created_at', ascending = false } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setErro('configuração ausente');
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data: rows, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
    if (error) {
      setErro(error.message);
    } else {
      setData(rows || []);
      setErro(null);
    }
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => {
    carregar();

    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => carregar())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [carregar, table]);

  return { data, loading, erro, reload: carregar };
}
