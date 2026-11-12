/* Cookie preferences for LoveToolsHub (vanilla-cookieconsent by Orest Bida). */
if (window.CookieConsent) {
  CookieConsent.run({
    mode: 'opt-in',
    cookie: {
      name: 'lovetoolshub_cookie_consent',
      expiresAfterDays: 182,
      sameSite: 'Lax'
    },
    guiOptions: {
      consentModal: {
        layout: 'cloud inline',
        position: 'bottom center',
        equalWeightButtons: true,
        flipButtons: false
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
        flipButtons: false
      }
    },
    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      advertisement: {}
    },
    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'Your privacy choices',
            description: 'LoveToolsHub uses essential cookies to keep the site working. With your permission, we also use advertising cookies to show sponsored content and support our free tools.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject non-essential',
            showPreferencesBtn: 'Manage choices',
            footer: '<a href="/cookie-policy/">Cookie Policy</a> · <a href="/privacy-policy/">Privacy Policy</a>'
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject non-essential',
            savePreferencesBtn: 'Save choices',
            closeIconLabel: 'Close',
            serviceCounterLabel: 'Service|Services',
            sections: [
              {
                title: 'Your privacy choices',
                description: 'You can choose which optional technologies you allow. You can return here at any time using the Cookie settings link in the footer.'
              },
              {
                title: 'Strictly necessary cookies',
                description: 'These cookies remember essential settings, such as your privacy choice, and cannot be turned off.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Advertising',
                description: 'These services may use cookies or similar technologies to display and measure advertising. This includes Google AdSense and Adsterra.',
                linkedCategory: 'advertisement'
              },
              {
                title: 'More information',
                description: 'Read our <a href="/cookie-policy/">Cookie Policy</a> and <a href="/privacy-policy/">Privacy Policy</a>, or contact us through our <a href="/contact/">Contact page</a>.'
              }
            ]
          }
        }
      }
    }
  });
}
