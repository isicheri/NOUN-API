import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
public client: SupabaseClient;

    constructor() {
        // this.client = createClient()
    }

}
