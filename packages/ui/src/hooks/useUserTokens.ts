import { paths, setParams } from '@reservoir0x/reservoir-kit-client'
import useReservoirClient from './useReservoirClient'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

type UserTokenResponse =
  paths['/users/{user}/tokens/v5']['get']['responses']['200']['schema']

type UserTokenQuery =
  paths['/users/{user}/tokens/v5']['get']['parameters']['query']

export default function (
  user?: string | undefined,
  options?: UserTokenQuery | false,
  swrOptions: SWRInfiniteConfiguration = {}
) {
  const client = useReservoirClient()

  const { data, mutate, error, isValidating, size, setSize } =
    useSWRInfinite<UserTokenResponse>(
      (pageIndex, previousPageData) => {
        if (!user) {
          return null
        }

        const url = new URL(`${client?.apiBase}/users/${user}/tokens/v5`)

        let query: UserTokenQuery = { ...options }

        if (previousPageData && previousPageData.tokens?.length === 0) {
          return null
        } else if (previousPageData && pageIndex > 0) {
          query.offset = (query?.limit || 20) * pageIndex
        }

        setParams(url, query)

        return [url.href, client?.apiKey, client?.version]
      },
      null,
      {
        revalidateOnMount: true,
        revalidateFirstPage: false,
        ...swrOptions,
      }
    )

  const tokens = data?.flatMap((page) => page.tokens) ?? []
  const lastPageTokenCount = data?.[size - 1]?.tokens?.length || 0
  const isFetchingInitialData = !data && !error
  const isFetchingPage =
    isFetchingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
  const hasNextPage = lastPageTokenCount > 0 || isFetchingPage
  const fetchNextPage = () => {
    if (!isFetchingPage && hasNextPage) {
      setSize((size) => size + 1)
    }
  }

  return {
    response: data,
    data: tokens,
    hasNextPage,
    isFetchingInitialData,
    isFetchingPage,
    fetchNextPage,
    setSize,
    mutate,
    error,
    isValidating,
  }
}
