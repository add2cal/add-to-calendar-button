// This script purges the Cloudflare cache for a specific zone. The respective npm script can be configured to run on deployment.

// Add those environment variables to your Cloudflare pages settings
const API_TOKEN = process.env.CF_PURGE_API_KEY;
const ZONE_ID = process.env.CF_PURGE_ZONE_ID;

// Send POST call to Cloudflare API to purge cache
const purgeCache = async () => {
  const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`;
  const data = {
    // if you only want to go for specific files, tags, host, etc., change the next line (https://developers.cloudflare.com/api/operations/zone-purge)
    purge_everything: true,
  };
  console.log('Purging cache...');
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + API_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  console.log(result);
};

purgeCache();
