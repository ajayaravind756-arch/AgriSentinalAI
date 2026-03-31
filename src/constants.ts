export const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", 
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

export const KERALA_DISTRICTS_ML = {
  "Thiruvananthapuram": "തിരുവനന്തപുരം",
  "Kollam": "കൊല്ലം",
  "Pathanamthitta": "പത്തനംതിട്ട",
  "Alappuzha": "ആലപ്പുഴ",
  "Kottayam": "കോട്ടയം",
  "Idukki": "ഇടുക്കി",
  "Ernakulam": "എറണാകുളം",
  "Thrissur": "തൃശ്ശൂർ",
  "Palakkad": "പാലക്കാട്",
  "Malappuram": "മലപ്പുറം",
  "Kozhikode": "കോഴിക്കോട്",
  "Wayanad": "വയനാട്",
  "Kannur": "കണ്ണൂർ",
  "Kasaragod": "കാസർഗോഡ്"
};

export const DISTRICT_COORDS: Record<string, [number, number]> = {
  "Thiruvananthapuram": [8.5241, 76.9366],
  "Kollam": [8.8932, 76.6141],
  "Pathanamthitta": [9.2648, 76.7870],
  "Alappuzha": [9.4981, 76.3388],
  "Kottayam": [9.5916, 76.5222],
  "Idukki": [9.8500, 77.0667],
  "Ernakulam": [9.9816, 76.2999],
  "Thrissur": [10.5276, 76.2144],
  "Palakkad": [10.7867, 76.6547],
  "Malappuram": [11.0735, 76.0740],
  "Kozhikode": [11.2588, 75.7804],
  "Wayanad": [11.6854, 76.1320],
  "Kannur": [11.8745, 75.3704],
  "Kasaragod": [12.4996, 74.9869]
};

export const CROPS = [
  { id: 'paddy', name: 'Paddy', name_ml: 'നെല്ല്', districts: ['Palakkad', 'Alappuzha', 'Thrissur'] },
  { id: 'coconut', name: 'Coconut', name_ml: 'തെങ്ങ്', districts: ['Kozhikode', 'Malappuram', 'Thiruvananthapuram'] },
  { id: 'banana', name: 'Banana', name_ml: 'വാഴ', districts: ['Thrissur', 'Wayanad', 'Palakkad'] },
  { id: 'pepper', name: 'Black Pepper', name_ml: 'കുരുമുളക്', districts: ['Idukki', 'Wayanad', 'Kannur'] },
  { id: 'rubber', name: 'Rubber', name_ml: 'റബ്ബർ', districts: ['Kottayam', 'Pathanamthitta', 'Ernakulam'] }
];

export const COMMON_DISEASES = [
  {
    name: "Rice Blast",
    name_ml: "നെല്ലിലെ കുമിൾ രോഗം (Rice Blast)",
    symptoms: ["Spindle-shaped spots on leaves", "Brownish lesions on nodes", "Neck rot", "Grain discoloration"],
    symptoms_ml: ["ഇലകളിൽ കതിർ ആകൃതിയിലുള്ള പുള്ളികൾ", "കണുകളിൽ തവിട്ടുനിറത്തിലുള്ള പാടുകൾ", "കഴുത്ത് ചീഞ്ഞഴുകൽ", "ധാന്യങ്ങളുടെ നിറം മാറുന്നു"],
    prevention: ["Resistant varieties", "Balanced nitrogen use", "Seed treatment with fungicides"],
    prevention_ml: ["പ്രതിരോധ ശേഷിയുള്ള ഇനങ്ങൾ", "സന്തുലിതമായ നൈട്രജൻ ഉപയോഗം", "കുമിൾനാശിനികൾ ഉപയോഗിച്ചുള്ള വിത്ത് ചികിത്സ"],
    riskFactors: ["High humidity", "Cool night temperatures", "Excessive nitrogen"],
    riskFactors_ml: ["ഉയർന്ന ഈർപ്പം", "തണുത്ത രാത്രി താപനില", "അമിതമായ നൈട്രജൻ"]
  },
  {
    name: "Coconut Root Wilt",
    name_ml: "തെങ്ങിലെ കാറ്റുവീഴ്ച (Coconut Root Wilt)",
    symptoms: ["Flaccidity of leaflets", "Yellowing of older leaves", "Necrosis of leaf tips", "Reduced nut size"],
    symptoms_ml: ["ഓലക്കാലുകളുടെ വാട്ടം", "പഴയ ഇലകൾ മഞ്ഞനിറമാകുന്നു", "ഇലകളുടെ അഗ്രം കരിയുന്നു", "തേങ്ങയുടെ വലിപ്പം കുറയുന്നു"],
    prevention: ["Removal of severely affected palms", "Balanced manuring", "Intercropping with cocoa/pepper"],
    prevention_ml: ["രോഗം ബാധിച്ച തെങ്ങുകൾ നീക്കം ചെയ്യുക", "സന്തുലിതമായ വളപ്രയോഗം", "കൊക്കോ/കുരുമുളക് എന്നിവയുമായുള്ള ഇടവിള കൃഷി"],
    riskFactors: ["Poor soil drainage", "Presence of lace wing bugs", "Nutrient deficiency"],
    riskFactors_ml: ["മോശം മണ്ണ് ഡ്രെയിനേജ്", "ലേസ് വിംഗ് ബഗുകളുടെ സാന്നിധ്യം", "പോഷകക്കുറവ്"]
  },
  {
    name: "Banana Bunchy Top",
    name_ml: "വാഴയിലെ കുടുങ്ങുവാഴ (Banana Bunchy Top)",
    symptoms: ["Dark green streaks on midrib", "Narrow, upright leaves", "Bunchy appearance at top", "Stunted growth"],
    symptoms_ml: ["ഞരമ്പുകളിൽ കടും പച്ച നിറത്തിലുള്ള വരകൾ", "ഇടുങ്ങിയതും നിവർന്നു നിൽക്കുന്നതുമായ ഇലകൾ", "മുകളിൽ കൂട്ടമായി കാണപ്പെടുന്നു", "വളർച്ച മുരടിക്കുന്നു"],
    prevention: ["Use of virus-free suckers", "Control of aphids", "Eradication of infected plants"],
    prevention_ml: ["രോഗമില്ലാത്ത കന്നുകൾ ഉപയോഗിക്കുക", "അഫിഡുകളെ നിയന്ത്രിക്കുക", "രോഗം ബാധിച്ച ചെടികൾ നശിപ്പിക്കുക"],
    riskFactors: ["Aphid population", "Contaminated planting material"],
    riskFactors_ml: ["അഫിഡ് ജനസംഖ്യ", "രോഗം ബാധിച്ച നടീൽ വസ്തുക്കൾ"]
  },
  {
    name: "Pepper Quick Wilt",
    name_ml: "കുരുമുളകിലെ ദ്രുതവാട്ടം (Pepper Quick Wilt)",
    symptoms: ["Sudden wilting of leaves", "Dark brown lesions on collar", "Root decay", "Leaf fall"],
    symptoms_ml: ["ഇലകൾ പെട്ടെന്ന് വാടുന്നു", "കഴുത്തിൽ കടും തവിട്ട് നിറത്തിലുള്ള പാടുകൾ", "വേര് ചീഞ്ഞഴുകൽ", "ഇല കൊഴിച്ചിൽ"],
    prevention: ["Proper drainage", "Application of Trichoderma", "Phytosanitation"],
    prevention_ml: ["ശരിയായ ഡ്രെയിനേജ്", "ട്രൈക്കോഡെർമ പ്രയോഗം", "ശുചിത്വം പാലിക്കുക"],
    riskFactors: ["Heavy monsoon rains", "Waterlogging", "Soil-borne pathogens"],
    riskFactors_ml: ["കനത്ത മൺസൂൺ മഴ", "വെള്ളക്കെട്ട്", "മണ്ണിലൂടെ പകരുന്ന രോഗകാരികൾ"]
  }
];

export const MARKET_PRICES = [
  { crop: 'Paddy', crop_ml: 'നെല്ല്', current: 28.5, forecast: 30.2, trend: 'up', unit: 'kg' },
  { crop: 'Coconut', crop_ml: 'തെങ്ങ്', current: 32.0, forecast: 28.5, trend: 'down', unit: 'piece' },
  { crop: 'Banana', crop_ml: 'വാഴ', current: 45.0, forecast: 48.2, trend: 'up', unit: 'kg' },
  { crop: 'Pepper', crop_ml: 'കുരുമുളക്', current: 620.0, forecast: 645.0, trend: 'up', unit: 'kg' },
  { crop: 'Rubber', crop_ml: 'റബ്ബർ', current: 185.0, forecast: 182.0, trend: 'down', unit: 'kg' }
];
