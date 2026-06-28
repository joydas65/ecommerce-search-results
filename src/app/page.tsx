import { SearchResultsShell } from "@/components/search/search-results-shell";
import { searchProducts } from "@/lib/products/search";
import {
  parseSearchParams,
  type RawSearchParams,
} from "@/lib/url-state/search-params";

interface HomeProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function Home({ searchParams }: HomeProps) {
  const request = parseSearchParams(await searchParams);
  const response = searchProducts(request);

  return <SearchResultsShell request={request} response={response} />;
}
