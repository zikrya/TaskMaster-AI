import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pwkzjwhwfguhtubedmmv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3a3pqd2h3Zmd1aHR1YmVkbW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0NzkzMjAsImV4cCI6MjAzMTA1NTMyMH0.9C_HQQBaEUuVpIOOEA1HwXxlRp2M917KbxwTR2Al0P4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);