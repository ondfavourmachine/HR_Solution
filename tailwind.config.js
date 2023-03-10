/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "hrms-hoverBlue-1": "#001C37",
        "hrms-genBlueColor-1": "#003366",
        "hrms-darkRed": "#bd243a",
        "hrms-slightRed": "#ff0033",
        "hrms-bgBlue-1": "#075bae",
        "hrms-bgBlue-2": "#043f7ar",
        "hrms-bgBlue-dark": "#002243",
        "hrms-dashboard-bg": "#F5F5F5",
        "hrms-col-bg": "#F2F8FF",
        "hrms-lightRed-bg": "#EB1D31",
        "hrms-border-red": "#EB2232",
        "hrms-gray-bg": "#E3E3E3",
        "hrms-green": "#38AB43",
        "hrms-text-dark": "#212121",
        "hrms-text-light": "#8F8F8F",
        "hrms-black-text": "#101010",
        "hrms-black-text-2": "#929292",
        "hrms-read-notification": "#707070",
        "hrms-dashboardSection-color": "#E4F1FF",
        "hrms-inactive-color": "#6F6F6F",
        "hrms-dull": "#CBCBCB",
        "hrms-banner-1": "#F4F5FA",
        "hrms-links-selected": "#82ADD870",
        "hrms-tab-color-selected": "#075DB2",
        "hrms-border-line-dull": "#DADADA",
        "hrms-border-dull-blue": '#15457D',
        'hrms-pending-color': '#FFF8E5',
        'hrms-pending-text-color': '#F89946',
        'hrms-calender-blue': '#F4F7FF',
        'hrms-day-text-color': '#979797'
      },
      fontFamily: {
        hrmsCamptonBook: ['Campton Book', 'sans-serif'],
        hrmsCamptonBookItalic: ['Campton Book Italic', 'serif'],
        hrmsCamptonLight: ['Campton Light', 'serif'],
        hrmsCamptonExtraLight: ['Campton Extra Light', 'serif'],
        hrmsCamptonExtraLightItalic: ['Campton Extra Light Italic', 'serif'],
        hrmsCamptonThin: ['Campton Thin', 'serif'],
        hrmsCamptonBold: ['Campton Bold Normal', 'serif'],
        hrmsCamptonMedium: ['Campton Medium', 'serif'],
        hrmsCamptonExtraBold: ['Campton Extra Bold', 'serif'],
        
      },  
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio'),require('@tailwindcss/forms'),require('@tailwindcss/line-clamp'),require('@tailwindcss/typography')],
}
