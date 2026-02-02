/**
 * Airtable Service - API Connection Layer
 * ========================================
 * This service handles all Airtable API communications
 * with built-in caching for performance optimization.
 *
 * Configuration:
 * - Base ID: appwlEJBlwoSBdKoT
 * - API calls are cached for 5 minutes to reduce API usage
 */

// ============================================
// CONFIGURATION - Update these values
// ============================================

const AIRTABLE_CONFIG = {
  // Your Airtable Personal Access Token
  // IMPORTANT: In production, use environment variables!
  API_TOKEN: import.meta.env.VITE_AIRTABLE_TOKEN || 'YOUR_TOKEN_HERE',

  // Your Base ID (from URL: airtable.com/appXXXXX)
  BASE_ID: 'appwlEJBlwoSBdKoT',

  // API Base URL
  API_URL: 'https://api.airtable.com/v0',

  // Cache duration in milliseconds (5 minutes)
  CACHE_DURATION: 5 * 60 * 1000,
};

// ============================================
// TYPES
// ============================================

export interface AirtableRecord<T = Record<string, unknown>> {
  id: string;
  createdTime: string;
  fields: T;
}

export interface AirtableResponse<T = Record<string, unknown>> {
  records: AirtableRecord<T>[];
  offset?: string;
}

export interface AirtableError {
  error: {
    type: string;
    message: string;
  };
}

// ============================================
// CACHE IMPLEMENTATION
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCachedData<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > AIRTABLE_CONFIG.CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache(): void {
  cache.clear();
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch records from an Airtable table
 * @param tableName - The name of the table (e.g., "Employees", "Projects")
 * @param options - Optional query parameters
 */
export async function fetchRecords<T = Record<string, unknown>>(
  tableName: string,
  options: {
    view?: string;
    filterByFormula?: string;
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
    maxRecords?: number;
    fields?: string[];
    useCache?: boolean;
  } = {}
): Promise<AirtableRecord<T>[]> {
  const { useCache = true, ...queryOptions } = options;

  // Generate cache key
  const cacheKey = `${tableName}:${JSON.stringify(queryOptions)}`;

  // Check cache first
  if (useCache) {
    const cached = getCachedData<AirtableRecord<T>[]>(cacheKey);
    if (cached) {
      console.log(`[Airtable] Cache hit for ${tableName}`);
      return cached;
    }
  }

  // Build URL with query parameters
  const url = new URL(`${AIRTABLE_CONFIG.API_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(tableName)}`);

  if (queryOptions.view) {
    url.searchParams.append('view', queryOptions.view);
  }
  if (queryOptions.filterByFormula) {
    url.searchParams.append('filterByFormula', queryOptions.filterByFormula);
  }
  if (queryOptions.maxRecords) {
    url.searchParams.append('maxRecords', queryOptions.maxRecords.toString());
  }
  if (queryOptions.fields) {
    queryOptions.fields.forEach(field => {
      url.searchParams.append('fields[]', field);
    });
  }
  if (queryOptions.sort) {
    queryOptions.sort.forEach((sortItem, index) => {
      url.searchParams.append(`sort[${index}][field]`, sortItem.field);
      url.searchParams.append(`sort[${index}][direction]`, sortItem.direction);
    });
  }

  // Fetch all pages
  const allRecords: AirtableRecord<T>[] = [];
  let offset: string | undefined;

  do {
    if (offset) {
      url.searchParams.set('offset', offset);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: AirtableError = await response.json();
      throw new Error(`Airtable API Error: ${error.error?.message || response.statusText}`);
    }

    const data: AirtableResponse<T> = await response.json();
    allRecords.push(...data.records);
    offset = data.offset;

  } while (offset);

  // Cache the results
  if (useCache) {
    setCachedData(cacheKey, allRecords);
  }

  console.log(`[Airtable] Fetched ${allRecords.length} records from ${tableName}`);
  return allRecords;
}

/**
 * Fetch a single record by ID
 */
export async function fetchRecord<T = Record<string, unknown>>(
  tableName: string,
  recordId: string
): Promise<AirtableRecord<T>> {
  const url = `${AIRTABLE_CONFIG.API_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(tableName)}/${recordId}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: AirtableError = await response.json();
    throw new Error(`Airtable API Error: ${error.error?.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new record
 */
export async function createRecord<T = Record<string, unknown>>(
  tableName: string,
  fields: Partial<T>
): Promise<AirtableRecord<T>> {
  const url = `${AIRTABLE_CONFIG.API_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(tableName)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error: AirtableError = await response.json();
    throw new Error(`Airtable API Error: ${error.error?.message || response.statusText}`);
  }

  // Clear cache for this table
  clearTableCache(tableName);

  return response.json();
}

/**
 * Update an existing record
 */
export async function updateRecord<T = Record<string, unknown>>(
  tableName: string,
  recordId: string,
  fields: Partial<T>
): Promise<AirtableRecord<T>> {
  const url = `${AIRTABLE_CONFIG.API_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(tableName)}/${recordId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error: AirtableError = await response.json();
    throw new Error(`Airtable API Error: ${error.error?.message || response.statusText}`);
  }

  // Clear cache for this table
  clearTableCache(tableName);

  return response.json();
}

/**
 * Delete a record
 */
export async function deleteRecord(
  tableName: string,
  recordId: string
): Promise<{ id: string; deleted: boolean }> {
  const url = `${AIRTABLE_CONFIG.API_URL}/${AIRTABLE_CONFIG.BASE_ID}/${encodeURIComponent(tableName)}/${recordId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error: AirtableError = await response.json();
    throw new Error(`Airtable API Error: ${error.error?.message || response.statusText}`);
  }

  // Clear cache for this table
  clearTableCache(tableName);

  return response.json();
}

/**
 * Clear cache for a specific table
 */
function clearTableCache(tableName: string): void {
  const keysToDelete: string[] = [];
  cache.forEach((_, key) => {
    if (key.startsWith(`${tableName}:`)) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => cache.delete(key));
}

// ============================================
// UTILITY HOOKS (for React components)
// ============================================

import { useState, useEffect, useCallback } from 'react';

export function useAirtableRecords<T = Record<string, unknown>>(
  tableName: string,
  options: Parameters<typeof fetchRecords>[1] = {}
) {
  const [records, setRecords] = useState<AirtableRecord<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecords<T>(tableName, { ...options, useCache: false });
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [tableName, JSON.stringify(options)]);

  useEffect(() => {
    fetchRecords<T>(tableName, options)
      .then(setRecords)
      .catch(err => setError(err instanceof Error ? err : new Error('Unknown error')))
      .finally(() => setLoading(false));
  }, [tableName, JSON.stringify(options)]);

  return { records, loading, error, refetch };
}

// ============================================
// EXPORT CONFIG FOR REFERENCE
// ============================================

export const config = AIRTABLE_CONFIG;
