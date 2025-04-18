import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkIpAddress(ipAddress: string) {
  if (process.env.NODE_ENV === "development") {
    return {
      success: true,
      message: "Development environment",
    };
  }
  type IpApi = {
    query: string;
    status: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    continentCode: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
    mobile: boolean;
    proxy: boolean;
    hosting: boolean;
  };
  const ipApiResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,continentCode,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`);
  const ipApiData: IpApi = await ipApiResponse.json();
  if (ipApiData.status !== "success") {
    return {
      success: false,
      message: "Non success status from ip-api",
    };
  }
  if (ipApiData.proxy) {
    return {
      success: false,
      message: "Proxy detected",
    };
  }
  if (ipApiData.hosting) {
    return {
      success: false,
      message: "Hosting detected",
    };
  }
  if (ipApiData.mobile) {
    return {
      success: true,
      message: "Mobile detected",
    };
  }
  if (ipApiData.countryCode === "US") {
    return {
      success: true,
      message: "Non mobile, non proxy/hosting, and in the US",
    };
  }
  if (ipApiData.continentCode === "NA") {
    return {
      success: true,
      message: "Non mobile, non proxy/hosting, and NA not in US",
    };
  }
  if (ipApiData.countryCode === "EU") {
    return {
      success: true,
      message: "Non mobile, non proxy/hosting, and is in EU",
    };
  }
  return {
    success: false,
    message: "IP address not allowed. Please contact support if you believe this is an error.",
  };
}

