type PaginationProps = {
  currentPage: number;
  hasNextPage: boolean;
  offset: number;
  limit: number;
  onChangeOffset: (offset: number) => void;
};

export function Pagination({
  currentPage,
  hasNextPage,
  offset,
  limit,
  onChangeOffset,
}: PaginationProps) {
  return (
    <div className="pagination">
      <button
        disabled={offset === 0}
        onClick={() => onChangeOffset(Math.max(offset - limit, 0))}
      >
        Previous
      </button>

      <span>Page {currentPage}</span>

      <button
        disabled={!hasNextPage}
        onClick={() => onChangeOffset(offset + limit)}
      >
        Next
      </button>
    </div>
  );
}