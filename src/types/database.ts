import type { Database as AuthDatabase } from './auth'
import type { Database as ProfilesDatabase } from './profiles'
import type { Database as ServicesDatabase } from './services'
import type { Database as BookingsDatabase } from './bookings'

export interface Database {
  public: {
    Tables: AuthDatabase['public']['Tables'] &
      ProfilesDatabase['public']['Tables'] &
      ServicesDatabase['public']['Tables'] &
      BookingsDatabase['public']['Tables']
    Enums: AuthDatabase['public']['Enums'] &
      ProfilesDatabase['public']['Enums'] &
      ServicesDatabase['public']['Enums'] &
      BookingsDatabase['public']['Enums']
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never