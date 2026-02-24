export const applySorting = <T extends { order: (column: string, options?: { ascending: boolean }) => T }>(query: T, sortBy?: string): T => {
  switch (sortBy) {
    case "oldest":
      return query.order("created_at", { ascending: true });
    case "name-asc":
      return query.order("name", { ascending: true });
    case "name-desc":
      return query.order("name", { ascending: false });
    case "newest":
    default:
      return query.order("created_at", { ascending: false });
  }
};