import "./Pagination.css";

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
    <section className="page-card">
      <div className="pagination">
        <button
          className="button button-secondary"
          disabled={offset === 0}
          onClick={() => onChangeOffset(Math.max(offset - limit, 0))}
        >
          Back
        </button>

        <span> Page {currentPage}</span>

        <button
          className="button button-primary"
          disabled={!hasNextPage}
          onClick={() => onChangeOffset(offset + limit)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
