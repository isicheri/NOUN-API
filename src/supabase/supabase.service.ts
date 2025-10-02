import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
@Injectable()
export class SupabaseService {
  public client: SupabaseClient;
  constructor() {}
}
