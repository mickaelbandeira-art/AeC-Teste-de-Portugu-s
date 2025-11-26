-- Run this script in the Supabase SQL Editor to grant admin permissions

-- 1. Update the role to 'admin' for the allowed users
UPDATE profiles
SET role = 'admin'
WHERE email IN (
  'jonathan.silva@aec.com.br',
  'kelciane.lima@aec.com.br',
  'a.izaura.bezerra@aec.com.br',
  'mickael.bandeira@aec.com.br'
);

-- 2. Verify the updates
SELECT email, role FROM profiles WHERE role = 'admin';
