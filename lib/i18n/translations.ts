export type Language = 'en' | 'hi';

export interface EventTranslation {
  name: string;
  day: string;
  date: string;
  time: string;
  description: string;
  venue: string;
  getDirections: string;
}

export interface Translations {
  blessingText: string;
  grandparents1: string;
  parents1: string;
  grandparents2: string;
  parents2: string;
  scrollCue: string;
  saveDateKicker: string;
  saveDateTitle: string;
  saveDateHint: string;
  saveDateMonth: string;
  saveDateDay: string;
  saveDateYear: string;
  saveDateDone: string;
  countdownTitle: string;
  countdownDays: string;
  countdownHours: string;
  countdownMinutes: string;
  countdownSeconds: string;
  calendarBtn: string;
  foreverTitle: string;
  foreverSub: string;
  galleryCaptions: string[];
  eventsTitle: string;
  eventsSub: string;
  events: EventTranslation[];
  footerLine1: string;
  footerLine2: string;
  getInTouch: string;
  callLabel: string;
  whatsappLabel: string;
  shareBtn: string;
  copiedNotice: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    blessingText: "With the blessings of Shri Ganesh Ji and our beloved families, we joyfully invite you to celebrate the marriage of",
    grandparents1: "Grandson of Late Shri Vimal Kumar Ji Daga & Late Smt. Sushila Devi Daga",
    parents1: "Son of Shri Pawan Kumar Daga & Smt. Suman Devi Daga",
    grandparents2: "Granddaughter of Shri Amar Chand Ji Mohta & Smt. Dewaki Devi Mohta",
    parents2: "Daughter of Shri Manoj Kumar Mohta & Smt. Shobha Devi Mohta",
    scrollCue: "SCROLL FOR MORE INFO ↓",
    saveDateKicker: "THE DATE",
    saveDateTitle: "Save the Date",
    saveDateHint: "Scratch below to reveal our wedding date",
    saveDateMonth: "JAN",
    saveDateDay: "25",
    saveDateYear: "2027",
    saveDateDone: "✨ See you there! ✨",
    countdownTitle: "Counting Down",
    countdownDays: "Days",
    countdownHours: "Hours",
    countdownMinutes: "Minutes",
    countdownSeconds: "Seconds",
    calendarBtn: "＋ Add to Calendar",
    foreverTitle: "Forever Us",
    foreverSub: "A few of our favourite moments",
    galleryCaptions: [
      "Where it all began",
      "Memories together",
      "Forever & always"
    ],
    eventsTitle: "Events & Rituals",
    eventsSub: "Join us across these celebrations",
    events: [
      {
        name: "Haldi & Mehndi",
        day: "Saturday",
        date: "23 Jan 2027",
        time: "3:00 PM",
        description: "A vibrant celebration of turmeric, fragrant henna, music and blessings.",
        venue: "Geetanjali Regency · VIP Road, Tegharia, Kolkata",
        getDirections: "📍 Get Directions"
      },
      {
        name: "Mayra",
        day: "Sunday",
        date: "24 Jan 2027",
        time: "10:00 AM",
        description: "A celebration of family, rich traditions, and heartfelt blessings.",
        venue: "Geetanjali Regency · VIP Road, Tegharia, Kolkata",
        getDirections: "📍 Get Directions"
      },
      {
        name: "Phere",
        day: "Monday",
        date: "25 Jan 2027",
        time: "7:00 PM",
        description: "The sacred vows and seven pheras around the holy fire.",
        venue: "Shehnai Garden Banquets · Dhapa, Kolkata",
        getDirections: "📍 Get Directions"
      }
    ],
    footerLine1: "Awaiting your presence and blessings",
    footerLine2: "Mohta Family",
    getInTouch: "Get in Touch",
    callLabel: "Call",
    whatsappLabel: "WhatsApp",
    shareBtn: "Share this invite",
    copiedNotice: "Link copied! ✓"
  },
  hi: {
    blessingText: "श्री गणेश जी एवं कुलदेवता के शुभाशीर्वाद से, हम अपने प्रियजनों के साथ आपको विवाह उत्सव में सम्मिलित होने हेतु सादर आमंत्रित करते हैं",
    grandparents1: "पौत्र: स्व. श्री विमल कुमार जी डागा एवं स्व. श्रीमती सुशीला देवी डागा",
    parents1: "सुपुत्र: श्रीमती सुमन देवी डागा एवं श्री पवन कुमार डागा",
    grandparents2: "पौत्री: श्री अमर चंद जी मोहता एवं श्रीमती देवकी देवी मोहता",
    parents2: "सुपुत्री: श्रीमती शोभा देवी मोहता एवं श्री मनोज कुमार मोहता",
    scrollCue: "विस्तृत जानकारी हेतु नीचे देखें ↓",
    saveDateKicker: "शुभ विवाह तिथि",
    saveDateTitle: "शुभ लग्न",
    saveDateHint: "विवाह तिथि देखने के लिए नीचे स्क्रैच करें",
    saveDateMonth: "जनवरी",
    saveDateDay: "२५",
    saveDateYear: "२०२७",
    saveDateDone: "✨ आप सादर आमंत्रित हैं ✨",
    countdownTitle: "शुभ विवाह की प्रतीक्षा",
    countdownDays: "दिन",
    countdownHours: "घंटे",
    countdownMinutes: "मिनट",
    countdownSeconds: "सेकंड",
    calendarBtn: "＋ कैलेंडर में जोड़ें",
    foreverTitle: "सुखद स्मृतियाँ",
    foreverSub: "हमारे कुछ सुंदर और यादगार पल",
    galleryCaptions: [
      "जहाँ से हुई शुरुआत",
      "साथ बिताए पल",
      "सदा के लिए"
    ],
    eventsTitle: "मांगलिक कार्यक्रम",
    eventsSub: "इन पावन उत्सवों में पधारकर हमें अनुगृहीत करें",
    events: [
      {
        name: "हल्दी एवं मेहंदी",
        day: "शनिवार",
        date: "२३ जनवरी २०२७",
        time: "दोपहर ३:०० बजे",
        description: "उल्लास, हरिद्रा, सुगंधित हिना और मांगलिक आशीर्वाद से सजी वेला।",
        venue: "गीतांजलि रीजेंसी · वीआईपी रोड, तेघरिया, कोलकाता",
        getDirections: "📍 रास्ता देखें"
      },
      {
        name: "मायरा",
        day: "रविवार",
        date: "२४ जनवरी २०२७",
        time: "प्रातः १०:०० बजे",
        description: "पारिवारिक परंपराओं, ननिहाल के अपार स्नेह और शुभाशीर्वाद का पावन उत्सव।",
        venue: "गीतांजलि रीजेंसी · वीआईपी रोड, तेघरिया, कोलकाता",
        getDirections: "📍 रास्ता देखें"
      },
      {
        name: "शुभ फेरे",
        day: "सोमवार",
        date: "२५ जनवरी २०२७",
        time: "सायं ७:०० बजे",
        description: "पवित्र अग्नि के समक्ष सात फेरे और सात जन्मों के पावन वचन।",
        venue: "शहनाई गार्डन बैंक्वेट्स · धापा, कोलकाता",
        getDirections: "📍 रास्ता देखें"
      }
    ],
    footerLine1: "आपकी स्नेहपूर्ण उपस्थिति एवं शुभाशीर्वाद की अभिलाषा में",
    footerLine2: "मोहता परिवार",
    getInTouch: "संपर्क सूत्र",
    callLabel: "कॉल",
    whatsappLabel: "व्हाट्सएप",
    shareBtn: "निमंत्रण साझा करें",
    copiedNotice: "लिंक कॉपी हो गया! ✓"
  }
};
