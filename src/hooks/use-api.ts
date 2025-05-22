import { useQuery, UseQueryResult } from "@tanstack/react-query";

const fetchData = async (fetchFunction: () => Promise<any>) => {
    return await fetchFunction();
};

const useApiFetch = (
    queryKey: string[],
    fetchFunction: () => Promise<any>
): UseQueryResult<any, Error> => {
    return useQuery({
        queryKey,
        queryFn: () => fetchData(fetchFunction),
    });
};

export default useApiFetch;