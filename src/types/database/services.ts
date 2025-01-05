export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          base_price: number;
          service_type: Database["public"]["Enums"]["service_type"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          base_price: number;
          service_type: Database["public"]["Enums"]["service_type"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          base_price?: number;
          service_type?: Database["public"]["Enums"]["service_type"];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      service_type:
        | "regular"
        | "deep_clean"
        | "move_in_out"
        | "post_construction";
    };
  };
}