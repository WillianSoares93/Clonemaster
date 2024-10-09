const { createClient } = require('@supabase/supabase-js');

// Credenciais do Supabase
const supabaseUrl = 'https://vswjldmrihidzqjiukel.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzd2psZG1yaWhpZHpxaml1a2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0NzEwNDcsImV4cCI6MjA0NDA0NzA0N30.FdfZLgFmaEpFg0N2ifL_B40FoCdrIKrVcj7TKWzY4y4';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
