export async function getRouteDetails(routeId: string) {
  const resp = await fetch(
    `https://go.bkk.hu/api/query/v1/ws/otp/api/where/route-details.json?routeId=BKK_${routeId}&related=false&operative=false&key=web-54feeb28-a942-48ae-89a5-9955879ebb2c&version=4&appVersion=3.18.0-164644-810354-e3dd8127`,
    {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,hu-HU;q=0.7,hu;q=0.6",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      "referrer": `https://go.bkk.hu/route/BKK_${routeId}`,
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include",
    },
  );
  return (await resp.json()).data.entry;
}

async function getRouteDetailsWithRelatedLines(routeId: string) {
  fetch(
    "https://go.bkk.hu/api/query/v1/ws/otp/api/where/route-details.json?routeId=BKK_4800&related=true&operative=false&key=web-54feeb28-a942-48ae-89a5-9955879ebb2c&version=4&appVersion=3.18.0-164644-810354-e3dd8127",
    {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en-GB;q=0.9,en;q=0.8,hu-HU;q=0.7,hu;q=0.6",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua":
          '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      "referrer": "https://go.bkk.hu/route/BKK_4800",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include",
    },
  );
}
