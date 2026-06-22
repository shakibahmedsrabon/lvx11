GRANT INSERT ON public.user_roles TO authenticated;

CREATE POLICY "Approved admin email can create own role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'admin'::public.app_role
  AND lower(coalesce(auth.jwt() ->> 'email', '')) = 'shakibahmedsrabon171@gmail.com'
);