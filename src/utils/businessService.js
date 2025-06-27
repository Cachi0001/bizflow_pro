import supabase from './supabaseClient';

const businessService = {
  // Invoice Management
  invoices: {
    getAll: async (userId) => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            client:clients(id, name, email)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('NetworkError')) {
          return {
            success: false, 
            error: 'Cannot connect to database. Your Supabase project may be paused or deleted.'
          }
        }
        return { success: false, error: 'Failed to load invoices.' }
      }
    },

    create: async (invoiceData) => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .insert(invoiceData)
          .select()
          .single()

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to create invoice.' }
      }
    },

    update: async (invoiceId, updates) => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .update(updates)
          .eq('id', invoiceId)
          .select()
          .single()

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to update invoice.' }
      }
    },

    delete: async (invoiceId) => {
      try {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', invoiceId)

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to delete invoice.' }
      }
    }
  },

  // Expense Management
  expenses: {
    getAll: async (userId) => {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('NetworkError')) {
          return {
            success: false, 
            error: 'Cannot connect to database. Your Supabase project may be paused or deleted.'
          }
        }
        return { success: false, error: 'Failed to load expenses.' }
      }
    },

    create: async (expenseData) => {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .insert(expenseData)
          .select()
          .single()

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to create expense.' }
      }
    },

    update: async (expenseId, updates) => {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .update(updates)
          .eq('id', expenseId)
          .select()
          .single()

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to update expense.' }
      }
    },

    delete: async (expenseId) => {
      try {
        const { error } = await supabase
          .from('expenses')
          .delete()
          .eq('id', expenseId)

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to delete expense.' }
      }
    }
  },

  // Client Management
  clients: {
    getAll: async (userId) => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('NetworkError')) {
          return {
            success: false, 
            error: 'Cannot connect to database. Your Supabase project may be paused or deleted.'
          }
        }
        return { success: false, error: 'Failed to load clients.' }
      }
    },

    create: async (clientData) => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert(clientData)
          .select()
          .single()

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to create client.' }
      }
    },

    update: async (clientId, updates) => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .update(updates)
          .eq('id', clientId)
          .select()
          .single()

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to update client.' }
      }
    },

    delete: async (clientId) => {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', clientId)

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true }
      } catch (error) {
        return { success: false, error: 'Failed to delete client.' }
      }
    }
  },

  // Analytics and Reports
  analytics: {
    getMonthlyRevenue: async (userId, month = new Date()) => {
      try {
        const { data, error } = await supabase
          .rpc('get_monthly_revenue', {
            user_uuid: userId,
            target_month: month.toISOString().split('T')[0]
          })

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to get monthly revenue.' }
      }
    },

    getMonthlyExpenses: async (userId, month = new Date()) => {
      try {
        const { data, error } = await supabase
          .rpc('get_monthly_expenses', {
            user_uuid: userId,
            target_month: month.toISOString().split('T')[0]
          })

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to get monthly expenses.' }
      }
    },

    getRecentTransactions: async (userId, limit = 10) => {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (error) {
          return { success: false, error: error.message }
        }

        return { success: true, data }
      } catch (error) {
        return { success: false, error: 'Failed to get recent transactions.' }
      }
    }
  }
}

export default businessService