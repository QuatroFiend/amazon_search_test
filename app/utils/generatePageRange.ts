export const generatePageRange = (
  pageCount: number,
  paginationPage: number,
) => {
  const maxVisible = 6
    if (pageCount <= maxVisible) {
      return Array.from({ length: pageCount }, (_, i) => i + 1)
    }

    let start = Math.max(2, paginationPage - Math.floor((maxVisible - 2) / 2))
    let end = Math.min(
      pageCount - 1,
      paginationPage + Math.floor((maxVisible - 2) / 2)
    )

    if (paginationPage <= Math.ceil(maxVisible / 2)) {
      start = 2
      end = maxVisible - 1
    } else if (paginationPage >= pageCount - Math.ceil(maxVisible / 2)) {
      start = pageCount - (maxVisible - 2)
      end = pageCount - 1
    }

    const pages: (number | string)[] = [1]

    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < pageCount - 1) pages.push('...')
    pages.push(pageCount)

    return pages

};
