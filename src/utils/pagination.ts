import { Response } from 'express';

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationQueryLike {
  page?: unknown;
  limit?: unknown;
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

const toSingleValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : undefined;
  }

  return typeof value === 'string' ? value : undefined;
};

export const parsePagination = (
  query: PaginationQueryLike,
  defaults = { defaultLimit: DEFAULT_LIMIT, maxLimit: MAX_LIMIT }
): PaginationOptions | undefined => {
  const pageValue = toSingleValue(query.page);
  const limitValue = toSingleValue(query.limit);

  if (pageValue === undefined && limitValue === undefined) {
    return undefined;
  }

  const parsedPage = pageValue ? Number.parseInt(pageValue, 10) : 1;
  const parsedLimit = limitValue ? Number.parseInt(limitValue, 10) : defaults.defaultLimit;

  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const safeLimitRaw = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : defaults.defaultLimit;
  const limit = Math.min(safeLimitRaw, defaults.maxLimit);

  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
};

export const applyPaginationHeaders = <T>(
  res: Response,
  pagination: PaginationOptions | undefined,
  items: T[]
): void => {
  res.setHeader('X-Pagination-Enabled', pagination ? 'true' : 'false');
  if (!pagination) {
    res.setHeader('X-Pagination-Count', String(items.length));
    return;
  }

  res.setHeader('X-Pagination-Page', String(pagination.page));
  res.setHeader('X-Pagination-Limit', String(pagination.limit));
  res.setHeader('X-Pagination-Offset', String(pagination.offset));
  res.setHeader('X-Pagination-Count', String(items.length));
};

