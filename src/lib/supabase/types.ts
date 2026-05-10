import type { TacticData } from "@/features/tactic/lib/types";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "inactive";

export type ProfileRow = {
  id: string;
  username: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type TacticRow = {
  id: string;
  user_id: string;
  name: string;
  data: TacticData;
  created_at: string;
  updated_at: string;
};

export type ShareRow = {
  id: string;
  tactic_id: string;
  slug: string;
  created_by: string;
  pin_hash: string | null;
  view_count: number;
  created_at: string;
};

export type SubscriptionRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  price_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Pick<ProfileRow, "id"> & Partial<Omit<ProfileRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<ProfileRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      tactics: {
        Row: TacticRow;
        Insert: { id?: string; user_id: string; name: string; data: TacticData };
        Update: { name?: string; data?: TacticData };
        Relationships: [];
      };
      shares: {
        Row: ShareRow;
        Insert: {
          tactic_id: string;
          slug: string;
          created_by: string;
          pin_hash?: string | null;
        };
        Update: never;
        Relationships: [];
      };
      subscriptions: {
        Row: SubscriptionRow;
        Insert: {
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: SubscriptionStatus;
          price_id?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
        };
        Update: {
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: SubscriptionStatus;
          price_id?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_shared_tactic_data: {
        Args: { p_slug: string; p_pin?: string | null };
        Returns: Record<string, unknown> | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
