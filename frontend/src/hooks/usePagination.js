/**
 * Pagination Hook
 * Manages pagination state and calculations
 */

import { useState, useMemo } from 'react'

export const usePagination = (data = [], itemsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1)

    const paginationData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedItems = data.slice(startIndex, endIndex)
        const totalPages = Math.ceil(data.length / itemsPerPage)

        return {
            items: paginatedItems,
            currentPage,
            totalPages,
            totalItems: data.length,
            itemsPerPage,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1
        }
    }, [data, currentPage, itemsPerPage])

    const goToPage = (page) => {
        if (page >= 1 && page <= paginationData.totalPages) {
            setCurrentPage(page)
        }
    }

    const nextPage = () => {
        if (paginationData.hasNextPage) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const prevPage = () => {
        if (paginationData.hasPrevPage) {
            setCurrentPage(prev => prev - 1)
        }
    }

    const reset = () => {
        setCurrentPage(1)
    }

    return {
        ...paginationData,
        goToPage,
        nextPage,
        prevPage,
        reset
    }
}
