import { useSearch } from "wouter";

export default function useSearchParams(){
  const queryString = useSearch()

  const searchParams = queryString.split('&').reduce((acc: Record<string, string | undefined>, searchParam) => {
    const [key, value] = searchParam.split('=')
    acc[key] = value
    return acc
  }
  , {})

  return searchParams
}