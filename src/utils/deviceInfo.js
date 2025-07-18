export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const browser = {
    name: (() => {
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Chrome")) return "Chrome";
      if (ua.includes("Safari")) return "Safari";
      if (ua.includes("Edge")) return "Edge";
      if (ua.includes("Opera")) return "Opera";
      return "Unknown";
    })(),
    version: (() => {
      const match = ua.match(/(Firefox|Chrome|Safari|Edge|Opera)\/([0-9.]+)/);
      return match ? match[2] : "Unknown";
    })(),
  };

  const device = {
    type: (() => {
      if (/Mobi|Android|iPhone/i.test(ua)) return "Mobile";
      if (/Tablet|iPad/i.test(ua)) return "Tablet";
      return "Desktop";
    })(),
    os: (() => {
      if (ua.includes("Windows")) return "Windows";
      if (ua.includes("Mac")) return "MacOS";
      if (ua.includes("Linux")) return "Linux";
      if (ua.includes("Android")) return "Android";
      if (ua.includes("iOS")) return "iOS";
      return "Unknown";
    })(),
  };

  return {
    browser: `${browser.name} ${browser.version}`,
    device: device.type,
    os: device.os,
    userAgent: ua,
  };
};
