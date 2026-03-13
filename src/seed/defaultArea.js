/** No global seed - each user gets their own default area on signup. */
export async function seedDefaultArea() {
  // Areas are created per-user on signup
}

/** No migration needed - products are user-scoped. */
export async function migrateProductsWithoutArea() {
  // Products require userId; no legacy migration for multi-tenant
}
