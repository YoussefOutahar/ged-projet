import { useQuery } from "@tanstack/react-query";
import useConnectedUserStore from "Stores/Users/ConnectedUserStore";
import axiosInstance from "app/axiosInterceptor";
import { CourrielBureauOrdre } from "app/controller/model/BureauOrdre/CourrielBureauOrdre";
import { useDebounce } from "primereact/hooks";
import React, { useEffect } from "react";
import { ReactNode, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export interface CourrielsContextProviderProps {
    children: ReactNode;
    useAllCourriels?: boolean;
}

const CourrielsContext = React.createContext(
    {
        courriels: {} as Page<CourrielBureauOrdre> | undefined,
        courrielsNearDeadline: {} as Page<CourrielBureauOrdre> | undefined,
        courrielsNeedingAttention: {} as Page<CourrielBureauOrdre> | undefined,
        loadingCourriels: true,
        errorCourriels: false,
        planClassementId: -1,
        fetchCourriels: async (planClassementId: number) => { },
        toggleCourrielsNeedingAttention: () => { },
        viewCourrielsNeedingAttention: false,
        toggleCourrielsNearDeadline: () => { },
        viewCourrielsNearDeadline: false,
        setPlanClassementId: (planClassementId: number) => { },
        handlePageNumberChange: (pageNumber: number) => { },
        setSearch: (search: string) => { },
    }
);

export function CourrielsProvider({ children, useAllCourriels }: CourrielsContextProviderProps) {

    const [planClassementId, setPlanClassementId] = useState<number>(-1);

    const [pageNumber, setPageNumber] = useState<number>(0);
    const { connectedUser } = useConnectedUserStore();

    // ------------- Fetch All Courriels pour B.O
    const fetchAllCourriels = async (userId: number, planClassementId: number): Promise<Page<CourrielBureauOrdre>> => {
        if (planClassementId === -1) {
            return await axiosInstance.get<Page<CourrielBureauOrdre>>(API_URL + '/courriels/peres', {
                params: {
                    page: pageNumber,
                    size: 5
                }
            }).then((res) => {
                return res.data;
            });
        } else {
            return await axiosInstance.get<Page<CourrielBureauOrdre>>(API_URL + `/courriels/plan-classement/${planClassementId}`, {
                params: {
                    page: pageNumber,
                    size: 5
                }

            }).then((res) => {
                return res.data;
            });
        }
    }

    // ------------- Fetch Mes Courriels pour Responsable
    const fetchMesCourriels = async (userId: number, planClassementId: number): Promise<Page<CourrielBureauOrdre>> => {
        if (connectedUser?.username) {
            if (planClassementId === -1) {
                return await axiosInstance.get<Page<CourrielBureauOrdre>>(API_URL + `/courriels/responsable/${userId}/peres`, {
                    params: {
                        page: pageNumber,
                        size: 5
                    }
                }).then((res) => {
                    return res.data;
                });
            } else {
                return await axiosInstance.get<Page<CourrielBureauOrdre>>(API_URL + `/courriels/responsable/${userId}/plan-classement/${planClassementId}`, {
                    params: {
                        page: pageNumber,
                        size: 5
                    }
                }).then((res) => {
                    return res.data;
                });
            }
        } else return {
            content: [],
            totalPages: 0,
            totalElements: 0,
            last: true,
            size: 0,
            number: 0,
            sort: {},
            first: true,
            numberOfElements: 0
        };
    };


    const getCourriels = useAllCourriels ? fetchAllCourriels : fetchMesCourriels;

    const {
        data: courrielsPage,
        isLoading: loadingCourriels,
        error: errorCourriels,
        refetch: fetchCourriels,
    } = useQuery<Page<CourrielBureauOrdre>, Error>(
        {
            queryKey: ['courriels', connectedUser?.id, planClassementId, pageNumber],
            queryFn: () => getCourriels(connectedUser!.id, planClassementId),
            enabled: !!connectedUser?.id,

        },
    );


    // ------- Fetch Courriels near deadline
    const [pageNumberCourrielsNearDeadline, setPageNumberCourrielsNearDeadline] = useState<number>(0);

    const fetchCourrielsNearDeadline = async (): Promise<Page<CourrielBureauOrdre>> => {
        return await axiosInstance.get<Page<CourrielBureauOrdre>>(API_URL + '/courriels/near-deadline', {
            params: {
                page: pageNumberCourrielsNearDeadline,
                size: 5
            }
        }).then((res) => {
            return res.data;
        });
    }

    const { data: courrielsNearDeadline, refetch: refetchCourrielsNearDeadline } = useQuery<Page<CourrielBureauOrdre>, Error>(
        {
            queryKey: ['courriels','courrielsNearDeadline', pageNumberCourrielsNearDeadline],
            queryFn: fetchCourrielsNearDeadline,
            enabled: !!connectedUser?.id,
        }
    );
    const [viewCourrielsNearDeadline, setViewCourrielsNearDeadline] = useState<boolean>(false);
    const toggleCourrielsNearDeadline = () => {
        setViewCourrielsNearDeadline(prev => !prev);
    };

    // ------- Fetch Courriels needing attention
    const [viewCourrielsNeedingAttention, setViewCourrielsNeedingAttention] = useState<boolean>(false);
    const [pageNumberCourrielsNeedingAttention, setPageNumberCourrielsNeedingAttention] = useState<number>(0);

    const fetchCourrielsNeedingAttention = async (): Promise<Page<CourrielBureauOrdre>> => {
        return await axiosInstance.get<Page<CourrielBureauOrdre>>(API_URL + `/courriels/needing-attention/${connectedUser?.id}`, {
            params: {
                page: pageNumberCourrielsNeedingAttention,
                size: 5
            }
        }).then((res) => {
            return res.data;
        });
    }

    const { data: courrielsNeedingAttention, refetch: refetchCourrielsNeedingAttention } = useQuery<Page<CourrielBureauOrdre>, Error>(
        {
            queryKey: ['courriels','courrielsNeedingAttention', connectedUser?.id, pageNumberCourrielsNeedingAttention],
            queryFn: fetchCourrielsNeedingAttention,
            enabled: !!connectedUser?.id

        }
    );
    const toggleCourrielsNeedingAttention = () => {
        setViewCourrielsNeedingAttention(prev => !prev);

    };

    // ----------- Fetch Courriels by search
    const [searchKeyWord, debouncedSearchKeyWord, setSearchKeyWord] = useDebounce('', 1000);
    const [viewCourrielsBySearch, setViewCourrielsBySearch] = useState<boolean>(true);
    const [pageNumberCourrielsBySearch, setPageNumberCourrielsBySearch] = useState<number>(0);

    useEffect(() => {
        if (debouncedSearchKeyWord === '') {
            setViewCourrielsBySearch(false);
        } else {
            setViewCourrielsBySearch(true);
        }
    }, [debouncedSearchKeyWord]);


    const fetchCourrielsBySearch = async (): Promise<Page<CourrielBureauOrdre>> => {
        return await axiosInstance.get<Page<CourrielBureauOrdre>>(API_URL + '/courriels/search', {
            params: {
                searchKeyWord: searchKeyWord,
                page: pageNumberCourrielsBySearch,
                size: 5,
                intervenantId: useAllCourriels ? 0 : connectedUser?.id
            }
        }).then((res) => {
            return res.data;
        });
    }

    const { data: courrielsBySearch, refetch: refetchCourrielsBySearch } = useQuery<Page<CourrielBureauOrdre>, Error>(
        {
            queryKey: ['courriels','courrielsBySearch', debouncedSearchKeyWord, pageNumberCourrielsBySearch, connectedUser?.id],
            queryFn: () => fetchCourrielsBySearch(),
            enabled: !!connectedUser?.id,
            gcTime: 1000,
        }
    );


    // ----------- custom diplsayed courriels
    const [displayedCourriels, setDisplayedCourriels] = useState<Page<CourrielBureauOrdre> | undefined>({} as Page<CourrielBureauOrdre>);

    const fetchCourrielsWrapper = async (planClassementId: number) => {
        if (viewCourrielsNearDeadline && courrielsNearDeadline?.totalElements !== 0) {
            await refetchCourrielsNearDeadline();
        } else if (viewCourrielsNeedingAttention && courrielsNeedingAttention?.totalElements !== 0) {
            await refetchCourrielsNeedingAttention();
        } else if (viewCourrielsBySearch) {
            await refetchCourrielsBySearch();
        } else {
            await fetchCourriels({});
        }
    };

    useEffect(() => {
        if (viewCourrielsNearDeadline && courrielsNearDeadline?.totalElements !== 0) {
            setDisplayedCourriels(courrielsNearDeadline);
        } else if (viewCourrielsNeedingAttention && courrielsNeedingAttention?.totalElements !== 0) {
            setDisplayedCourriels(courrielsNeedingAttention);
        } else if (viewCourrielsBySearch) {
            setDisplayedCourriels(courrielsBySearch);
        } else {
            setDisplayedCourriels(courrielsPage);
        }
    }, [viewCourrielsNearDeadline, viewCourrielsNeedingAttention, viewCourrielsBySearch, courrielsBySearch, courrielsNeedingAttention, courrielsNearDeadline, courrielsPage]);

    // handle page number change
    const handlePageNumberChange = (pageNumber: number) => {
        if (viewCourrielsNearDeadline) {
            setPageNumberCourrielsNearDeadline(pageNumber);
        } else if (viewCourrielsNeedingAttention) {
            setPageNumberCourrielsNeedingAttention(pageNumber);
        } else if (viewCourrielsBySearch) {
            setPageNumberCourrielsBySearch(pageNumber);
        } else {
            setPageNumber(pageNumber);
        }
    };

    return (
        <CourrielsContext.Provider value={{
            courriels: displayedCourriels,
            courrielsNearDeadline,
            courrielsNeedingAttention,
            loadingCourriels,
            errorCourriels: !!errorCourriels,
            planClassementId,
            fetchCourriels: fetchCourrielsWrapper,
            toggleCourrielsNeedingAttention,
            viewCourrielsNeedingAttention,
            toggleCourrielsNearDeadline,
            viewCourrielsNearDeadline,
            setPlanClassementId,
            handlePageNumberChange: handlePageNumberChange,
            setSearch: setSearchKeyWord,
        }}>
            {children}
        </CourrielsContext.Provider>
    );
}

export function useCourrielsContext() {
    return React.useContext(CourrielsContext);
}