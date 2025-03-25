import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qxrwahceimnnfklzwhrt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4cndhaGNlaW1ubmZrbHp3aHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzODA5NTQsImV4cCI6MjAzMDk1Njk1NH0.IYU8JM7Fu8qdkQU5Ry9Ep-2zfgfOFWO7Ns1eC4yv3hk";

export const supabase = createClient(supabaseUrl, supabaseKey);
