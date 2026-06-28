import { NextResponse, type NextRequest } from "next/server";
import { searchProducts } from "@/lib/products/search";
import {
  parseSearchParams,
  type RawSearchParams,
} from "@/lib/url-state/search-params";

const toRawSearchParams = (searchParams: URLSearchParams): RawSearchParams => {
  const rawParams: RawSearchParams = {};

  for (const [key, value] of searchParams) {
    const currentValue = rawParams[key];

    if (currentValue === undefined) {
      rawParams[key] = value;
    } else if (Array.isArray(currentValue)) {
      currentValue.push(value);
    } else {
      rawParams[key] = [currentValue, value];
    }
  }

  return rawParams;
};

export function GET(request: NextRequest) {
  const searchRequest = parseSearchParams(
    toRawSearchParams(request.nextUrl.searchParams),
  );
  const response = searchProducts(searchRequest);

  return NextResponse.json(response);
}
