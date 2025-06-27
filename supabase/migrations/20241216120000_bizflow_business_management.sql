-- BizFlow Pro Business Management System
-- Complete database schema for business financial management

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.transaction_type AS ENUM ('invoice', 'expense', 'payment');
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE public.expense_category AS ENUM ('office', 'utilities', 'marketing', 'travel', 'equipment', 'software', 'other');
CREATE TYPE public.payment_method AS ENUM ('bank_transfer', 'cash', 'card', 'paystack', 'stripe');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'premium', 'enterprise');

-- 2. User Profiles (Critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    business_name TEXT,
    phone TEXT,
    role public.user_role DEFAULT 'member'::public.user_role,
    subscription_tier public.subscription_tier DEFAULT 'free'::public.subscription_tier,
    subscription_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Business Core Tables
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    business_type TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    status public.invoice_status DEFAULT 'draft'::public.invoice_status,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMPTZ
);

CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    category public.expense_category DEFAULT 'other'::public.expense_category,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method public.payment_method DEFAULT 'bank_transfer'::public.payment_method,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    type public.transaction_type NOT NULL,
    reference_id UUID, -- Can reference invoices, expenses, or payments
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Essential Indexes
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);

-- 5. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 6. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_owner(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT auth.uid() = user_uuid
$$;

CREATE OR REPLACE FUNCTION public.has_business_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role::TEXT = required_role
)
$$;

-- 7. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles FOR ALL
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users_manage_own_clients" ON public.clients FOR ALL
USING (public.is_owner(user_id)) WITH CHECK (public.is_owner(user_id));

CREATE POLICY "users_manage_own_invoices" ON public.invoices FOR ALL
USING (public.is_owner(user_id)) WITH CHECK (public.is_owner(user_id));

CREATE POLICY "users_manage_own_expenses" ON public.expenses FOR ALL
USING (public.is_owner(user_id)) WITH CHECK (public.is_owner(user_id));

CREATE POLICY "users_manage_own_payments" ON public.payments FOR ALL
USING (public.is_owner(user_id)) WITH CHECK (public.is_owner(user_id));

CREATE POLICY "users_manage_own_transactions" ON public.transactions FOR ALL
USING (public.is_owner(user_id)) WITH CHECK (public.is_owner(user_id));

-- 8. Trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Business Intelligence Functions
CREATE OR REPLACE FUNCTION public.get_monthly_revenue(user_uuid UUID, target_month DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL(15,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(SUM(i.amount), 0)
FROM public.invoices i
WHERE i.user_id = user_uuid 
AND i.status = 'paid'::public.invoice_status AND DATE_TRUNC('month', i.paid_at) = DATE_TRUNC('month', target_month)
$$;

CREATE OR REPLACE FUNCTION public.get_monthly_expenses(user_uuid UUID, target_month DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL(15,2)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT COALESCE(SUM(e.amount), 0)
FROM public.expenses e
WHERE e.user_id = user_uuid 
AND DATE_TRUNC('month', e.created_at) = DATE_TRUNC('month', target_month)
$$;

-- 10. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    client1_uuid UUID := gen_random_uuid();
    client2_uuid UUID := gen_random_uuid();
    invoice1_uuid UUID := gen_random_uuid();
    invoice2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@bizflow.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Adebayo", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@bizflow.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Kemi Okonkwo", "role": "member"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create clients
    INSERT INTO public.clients (id, user_id, name, email, phone, business_type) VALUES
        (client1_uuid, admin_uuid, 'Adebayo Enterprises', 'contact@adebayoenterprises.com', '+234-800-1234-567', 'Technology'),
        (client2_uuid, admin_uuid, 'Kemi Fashion Store', 'orders@kemifashion.com', '+234-800-2345-678', 'Retail');

    -- Create invoices
    INSERT INTO public.invoices (id, user_id, client_id, invoice_number, title, amount, status, due_date, paid_at) VALUES
        (invoice1_uuid, admin_uuid, client1_uuid, 'INV-2024-001', 'Website Development', 450000.00, 'paid'::public.invoice_status, '2024-12-30', '2024-12-15 10:30:00'),
        (invoice2_uuid, admin_uuid, client2_uuid, 'INV-2024-002', 'E-commerce Platform', 280000.00, 'paid'::public.invoice_status, '2024-12-25', '2024-12-13 14:20:00');

    -- Create expenses
    INSERT INTO public.expenses (user_id, title, amount, category) VALUES
        (admin_uuid, 'Office Rent - December', 120000.00, 'office'::public.expense_category),
        (admin_uuid, 'Internet & Phone Bills', 25000.00, 'utilities'::public.expense_category),
        (admin_uuid, 'Adobe Creative Suite', 15000.00, 'software'::public.expense_category);

    -- Create payments
    INSERT INTO public.payments (user_id, invoice_id, amount, payment_method, reference_number) VALUES
        (admin_uuid, invoice1_uuid, 450000.00, 'bank_transfer'::public.payment_method, 'TXN-450K-2024-001'),
        (admin_uuid, invoice2_uuid, 280000.00, 'paystack'::public.payment_method, 'PSK-280K-2024-002');

    -- Create transaction records
    INSERT INTO public.transactions (user_id, type, reference_id, description, amount) VALUES
        (admin_uuid, 'invoice'::public.transaction_type, invoice1_uuid, 'Website Development - Adebayo Enterprises', 450000.00),
        (admin_uuid, 'invoice'::public.transaction_type, invoice2_uuid, 'E-commerce Platform - Kemi Fashion Store', 280000.00),
        (admin_uuid, 'expense'::public.transaction_type, null, 'Office Rent - December', -120000.00),
        (admin_uuid, 'expense'::public.transaction_type, null, 'Internet & Phone Bills', -25000.00);

END $$;