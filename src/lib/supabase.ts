import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://ohtcpyenfichlankigkz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odGNweWVuZmljaGxhbmtpZ2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzAwMDUsImV4cCI6MjA0ODIwNjAwNX0.qtahZ5EBQIS91AJk8hIhISnBsHGdy8zfinb2dhMx7Fw';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);