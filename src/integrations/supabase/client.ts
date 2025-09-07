import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jliypnuzvlyerzalwbms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsaXlwbnV6dmx5ZXJ6YWx3Ym1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTE3NTgsImV4cCI6MjA3MjgyNzc1OH0._pSxvwVtW8odtMww2wu5Ez8VgbmXBXciS1xxw8XpTYI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);