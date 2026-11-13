const amenityIcons = {
  "AC / Air conditioning": "snowy-line",
  "Wi-Fi": "wifi-line",
  "Power backup": "battery-charge-line",
  "Valet parking": "steering-2-line",
  "Car parking": "parking-box-line",
  "In-house catering": "restaurant-2-line",
  "In-house decor": "flower-line",
  "Outside decor allowed": "sparkling-line",
  "DJ allowed": "headphone-line",
  "Alcohol allowed": "goblet-line",
  "Bridal room": "door-open-line",
  "Groom room": "door-open-line",
  "Changing room": "t-shirt-line",
  Stage: "presentation-line",
  "LED screen": "tv-2-line",
  Projector: "projector-line",
  "Sound system": "speaker-2-line",
  "Dance floor": "music-2-line",
  "Fire safety": "fire-line",
  "Wheelchair access": "wheelchair-line",
  "Lift / Elevator": "arrow-up-down-line",
  Washrooms: "men-line",
  "Security staff": "shield-user-line",
  "CCTV surveillance": "vidicon-line",
  "Smoking area": "information-line",
  "Pet friendly": "bear-smile-line",
  Generator: "flashlight-line",
  "Kids play area": "gamepad-line",
};

const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
const iconsByName = new Map(Object.entries(amenityIcons).map(([name, icon]) => [normalize(name), icon]));

export const amenityIcon = (name) => iconsByName.get(normalize(name)) || "checkbox-circle-line";
