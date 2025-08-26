
import { useEffect, useState } from "react";

export function extractDomain(referrer) {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    // Get hostname (e.g., "www.linkedin.com") and extract the main domain (e.g., "linkedin")
    const hostname = url.hostname;
    const parts = hostname.split(".");
    console.log(parts,"parts")
    // Return the part before the TLD (e.g., "linkedin" from "www.linkedin.com")
    return parts[parts.length - 2] || hostname;
  } catch (e) {
    // Fallback to raw referrer if URL parsing fails
    return referrer;
  }
}

export default function useTrafficSource() {
  const [trafficSource, setTrafficSource] = useState({
    source: "direct",
    medium: "none",
    campaign: "none",
    method: "direct",
  });

  useEffect(() => {
    let sourceData = {
      source: "direct",
      medium: "none",
      campaign: "none",
      method: "direct",
    };

    // Check document.referrer
    const ref = document.referrer;
    if (ref) {
      const domain = extractDomain(ref);
      console.log(domain,"domain")
      if (domain) {
        sourceData = {
          source: ref,
          medium: "referral",
          campaign: "none",
          method: "referrer",
        };
      }
    }

    // Save to localStorage if sourceData is not default
    if (sourceData.source !== "direct") {
      localStorage.setItem("trafficSource", JSON.stringify(sourceData));
    }

    setTrafficSource(sourceData);
    console.log("📊 Traffic Source =>", sourceData);
  }, []);

  return trafficSource;
}