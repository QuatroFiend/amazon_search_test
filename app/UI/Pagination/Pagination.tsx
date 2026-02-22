import Icon from '../Icon/Icon'
import styles from './pagination.module.css'

export interface IPagination {
  page: number
  pageCount: number
  pageSize: number
  total: number
}


interface Props {
  pagination: IPagination
  paginationPage: number
}


 const Pagination = ({  pagination, paginationPage }: Props) => {
  const pages = Array.from({ length: pagination.pageCount }, (_, i) => i + 1);

  return (
    <div className={styles.paginationWrapper}>
      <button
        className={paginationPage === 1 ? styles.navButtonDisabled : styles.navButton}
        disabled={paginationPage === 1}
      >
         <Icon name={"ArrowLeft"} /> Prev
      </button>
      <div className={styles.pagesContainer}>
        {pages.map((page) => (
          <span
            key={page}
            className={paginationPage === page ? styles.pageLinkActive : styles.pageLink}
          >
            {page}
          </span>
        ))}
      </div>
      <button
        className={paginationPage === pagination.pageCount ? styles.navButtonDisabled : styles.navButton}
        disabled={paginationPage === pagination.pageCount}
      >
       Next <Icon name={"ArrowRight"} /> 
      </button>
    </div>
  );
};

export default Pagination;