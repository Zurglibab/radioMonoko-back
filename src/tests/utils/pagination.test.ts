import { parsePagination, applyPaginationHeaders } from '../../utils/pagination';
import { Response } from 'express';

describe('Pagination Utils', () => {
  describe('parsePagination', () => {
    it('should return undefined when both page and limit are missing', () => {
      expect(parsePagination({})).toBeUndefined();
    });

    it('should parse page and limit when both are valid strings', () => {
      const result = parsePagination({ page: '2', limit: '10' });
      expect(result).toEqual({
        page: 2,
        limit: 10,
        offset: 10,
      });
    });

    it('should use default limit when limit is missing but page is provided', () => {
      const result = parsePagination({ page: '3' });
      expect(result).toEqual({
        page: 3,
        limit: 50,
        offset: 100,
      });
    });

    it('should use default page (1) when page is missing but limit is provided', () => {
      const result = parsePagination({ limit: '20' });
      expect(result).toEqual({
        page: 1,
        limit: 20,
        offset: 0,
      });
    });

    it('should fallback to default page (1) if page value is invalid', () => {
      expect(parsePagination({ page: 'abc' })).toEqual({
        page: 1,
        limit: 50,
        offset: 0,
      });
      expect(parsePagination({ page: '-5' })).toEqual({
        page: 1,
        limit: 50,
        offset: 0,
      });
      expect(parsePagination({ page: '0' })).toEqual({
        page: 1,
        limit: 50,
        offset: 0,
      });
    });

    it('should fallback to default limit if limit value is invalid', () => {
      expect(parsePagination({ limit: 'abc' })).toEqual({
        page: 1,
        limit: 50,
        offset: 0,
      });
      expect(parsePagination({ limit: '-10' })).toEqual({
        page: 1,
        limit: 50,
        offset: 0,
      });
      expect(parsePagination({ limit: '0' })).toEqual({
        page: 1,
        limit: 50,
        offset: 0,
      });
    });

    it('should cap the limit at maxLimit', () => {
      const result = parsePagination({ limit: '500' });
      expect(result).toEqual({
        page: 1,
        limit: 100, // MAX_LIMIT
        offset: 0,
      });
    });

    it('should support custom defaults and maxLimit overrides', () => {
      const customDefaults = { defaultLimit: 5, maxLimit: 8 };
      const result = parsePagination({ limit: '10' }, customDefaults);
      expect(result).toEqual({
        page: 1,
        limit: 8,
        offset: 0,
      });
    });

    it('should parse single value from array query params', () => {
      const result = parsePagination({ page: ['3', '4'], limit: ['15', '20'] });
      expect(result).toEqual({
        page: 3,
        limit: 15,
        offset: 30,
      });
    });
  });

  describe('applyPaginationHeaders', () => {
    let mockResponse: Partial<Response>;
    let setHeaderMock: jest.Mock;

    beforeEach(() => {
      setHeaderMock = jest.fn();
      mockResponse = {
        setHeader: setHeaderMock,
      } as unknown as Response;
    });

    it('should set X-Pagination-Enabled to false and include count when pagination is undefined', () => {
      applyPaginationHeaders(mockResponse as Response, undefined, [1, 2, 3]);

      expect(setHeaderMock).toHaveBeenCalledTimes(2);
      expect(setHeaderMock).toHaveBeenCalledWith('X-Pagination-Enabled', 'false');
      expect(setHeaderMock).toHaveBeenCalledWith('X-Pagination-Count', '3');
    });

    it('should set all pagination headers when pagination is defined', () => {
      const pagination = { page: 2, limit: 10, offset: 10 };
      applyPaginationHeaders(mockResponse as Response, pagination, [1, 2, 3, 4, 5]);

      expect(setHeaderMock).toHaveBeenCalledTimes(5);
      expect(setHeaderMock).toHaveBeenCalledWith('X-Pagination-Enabled', 'true');
      expect(setHeaderMock).toHaveBeenCalledWith('X-Pagination-Page', '2');
      expect(setHeaderMock).toHaveBeenCalledWith('X-Pagination-Limit', '10');
      expect(setHeaderMock).toHaveBeenCalledWith('X-Pagination-Offset', '10');
      expect(setHeaderMock).toHaveBeenCalledWith('X-Pagination-Count', '5');
    });
  });
});
