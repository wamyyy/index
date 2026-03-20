// ============================================================
//  supabase-config.js  –  Supabase client (CDN / browser ESM)
//  Import this with:  import { supabase } from './supabase-config.js'
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL  = 'https://udxsycnidkhagvsnmvkk.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkeHN5Y25pZGtoYWd2c25tdmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTgzNDYsImV4cCI6MjA4OTU5NDM0Nn0._Z7s1HxwzXCxEyLRtTOVQyhKWgtip-RJyNiz7gVCzHQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);
