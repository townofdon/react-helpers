
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { path }  from 'ramda';


//  __  __     ______     ______     ______     __  __     ______     ______     __  __     __         __     ______     ______  
// /\ \/\ \   /\  ___\   /\  ___\   /\  __ \   /\ \/\ \   /\  ___\   /\  == \   /\ \_\ \   /\ \       /\ \   /\  ___\   /\__  _\ 
// \ \ \_\ \  \ \___  \  \ \  __\   \ \ \/\_\  \ \ \_\ \  \ \  __\   \ \  __<   \ \____ \  \ \ \____  \ \ \  \ \___  \  \/_/\ \/ 
//  \ \_____\  \/\_____\  \ \_____\  \ \___\_\  \ \_____\  \ \_____\  \ \_\ \_\  \/\_____\  \ \_____\  \ \_\  \/\_____\    \ \_\ 
//   \/_____/   \/_____/   \/_____/   \/___/_/   \/_____/   \/_____/   \/_/ /_/   \/_____/   \/_____/   \/_/   \/_____/     \/_/ 
// 

interface FetchVariables {
  page?: number;
  perPage?: number;
  filters?: { [key: string]: any }
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

type Alert = {
  type: "success" | "info" | "warning" | "error";
  message: string;
  [key: string]: any;
};

type Obj = { [key: string]: any };

type Params = {
  onVars?: (sortOption: string, searchValue: string, filter: string) => Obj;
  onFilter?: (sortOption: string, searchValue: string, filter: string) => Obj;
  onFetch: () => void;
  dataKey: string;
  defaultPagination?: Pagination;
};

type ReturnValue = {
  data: Obj;
  isLoading: boolean;
  totalCount: number;
  searchValue: string;
  pagination: Obj;
  alert: Alert | null;
  onTableChange: (paginationNew: Obj, filters: Obj, sorter: Obj) => void;
  setSearchValue: (val: string) => void;
};

export default function useList({
  onVars,
  onFilter,
  onFetch,
  dataKey,
  defaultPagination = {},
}: Params): ReturnValue {
  const initialPagination = () => ({
    current: 1,
    pageSize: 10,
    total: 0,
    ...defaultPagination
  });
  const [alert, setAlert]: [Alert, (Alert) => void] = React.useState(null);
  const [sortOption, setSortOption] = React.useState("name asc");
  const [searchValue, setSearchValue] = React.useState("");
  const [filters, setFilters] = React.useState(null);
  const [pagination, setPagination] = React.useState(initialPagination());
  const resetPagination = () => setPagination(initialPagination());

  //
  // When searching, reset pagination
  //
  React.useEffect(() => {
    if (pagination.current !== 1) {
      resetPagination();
    }
  }, [searchValue]);

  const fetchVariables: FetchVariables = {
    page: pagination.current,
    perPage: pagination.pageSize,
    filters: {
      s: sortOption,
      ...(onFilter ? onFilter(sortOption, searchValue, filters) : {}),
    },
    ...(onVars ? onVars(sortOption, searchValue, filters) : {}),
  };

  //
  // Fetch data
  //
  const {
    data,
    loading: isLoading,
    fetchMore,
  } = useQuery<any, FetchVariables>(onFetch, {
    variables: fetchVariables,
    onCompleted: () => {
      setAlert(null);
    },
    onError: (err) => {
      setAlert(err);
    },
  });

  //
  // Re-fetch data whenever any fetchVariables change
  //
  React.useEffect(() => {
    fetchMore({
      variables: fetchVariables,
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return fetchMoreResult;
      }
    })
  }, [
    fetchVariables.page,
    fetchVariables.perPage,
    fetchVariables.filters,
  ]);

  const totalCount = path([dataKey, 'totalCount'], data) || 0;
  const paginationWithTotal = {
    ...pagination,
    total: totalCount,
  };

  //
  // handle graphql errors (note that these come from a successful 200 response)
  //
  const errors = path([dataKey, 'errors'], data) || [];
  React.useEffect(() => {
    if (errors && errors.length) {
      setAlert(errors[0]);
    } else {
      setAlert(null);
    }
  }, [errors]);

  const onTableChange = (paginationNew, newFilters, sorter) => {
    setPagination(paginationNew);
    setFilters(newFilters);

    if (sorter.columnKey === undefined) {
      setSortOption("id asc");
    } else {
      const sortOrder = sorter.order === "ascend" ? "asc" : "desc";
      setSortOption(`${sorter.columnKey} ${sortOrder}`);
    }
  };

  return {
    data,
    isLoading,
    totalCount,
    searchValue,
    pagination: paginationWithTotal,
    alert,
    onTableChange,
    setSearchValue,
  };
}
