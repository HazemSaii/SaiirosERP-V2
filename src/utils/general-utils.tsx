// export function formatDateTimeToISOString(date:any|null) {
//     if (!date) {
//       return null;
//     }
//     const offset = date.getTimezoneOffset();
//     const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
//     return adjustedDate.toISOString();
//   }



export function formatDateTimeToISOString(dateTimeString: string | null | undefined): string | null {
  if (!dateTimeString) return null;

  // Try parsing the input string using the Date constructor
  const parsedDate = new Date(dateTimeString);

  // Check if the parsed date is valid
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString();
  }

  // Custom patterns for parsing non-standard date formats
  const dateTimePatterns: { regex: RegExp; handler: (matches: RegExpMatchArray) => string }[] = [
    {
      // Example pattern: "dd-mm-yyyy hh:mm:ss GMT"
      regex: /(\d{2})-(\d{2})-(\d{4}) (\d{2}:\d{2}:\d{2}) (GMT)/,
      handler: ([, day, month, year, time]) => `${year}-${month}-${day}T${time}Z`,
    },
    {
      // Example pattern: "mm/dd/yyyy hh:mm:ss"
      regex: /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2}:\d{2})/,
      handler: ([, month, day, year, time]) => `${year}-${month}-${day}T${time}Z`,
    },
    {
      // Example pattern: "yyyy-mm-dd hh:mm:ss"
      regex: /(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2}:\d{2})/,
      handler: ([, year, month, day, time]) => `${year}-${month}-${day}T${time}Z`,
    },
    {
      // ISO 8601 pattern: "yyyy-mm-ddThh:mm:ssZ"
      regex: /(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}:\d{2})Z/,
      handler: ([, year, month, day, time]) => `${year}-${month}-${day}T${time}Z`,
    },
    {
      // Example pattern: "dd-mm-yyyy"
      regex: /(\d{2})-(\d{2})-(\d{4})/,
      handler: ([, day, month, year]) => `${year}-${month}-${day}T00:00:00Z`,
    },
    {
      // Example pattern: "mm/dd/yyyy"
      regex: /(\d{2})\/(\d{2})\/(\d{4})/,
      handler: ([, month, day, year]) => `${year}-${month}-${day}T00:00:00Z`,
    },
    {
      // Example pattern: "yyyy-mm-dd"
      regex: /(\d{4})-(\d{2})-(\d{2})/,
      handler: ([, year, month, day]) => `${year}-${month}-${day}T00:00:00Z`,
    },
    {
      // Example pattern: "yyyy/mm/dd hh:mm:ss"
      regex: /(\d{4})\/(\d{2})\/(\d{2}) (\d{2}:\d{2}:\d{2})/,
      handler: ([, year, month, day, time]) => `${year}-${month}-${day}T${time}Z`,
    },
    {
      // New pattern: "dd-MMMM-yyyy" (e.g., "13-October-2024")
      regex: /(\d{2})-(\w+)-(\d{4})/,
      handler: ([, day, month, year]) => {
        const monthIndex = new Date(Date.parse(`${month} 1, 2020`)).getMonth(); // Use a dummy date to get the month index
        return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${day}T00:00:00Z`; // Convert to ISO format
      },
    }
  ];

  // Find the first pattern that matches the input string
  const matchedPattern = dateTimePatterns.find(({ regex }) => regex.test(dateTimeString));

  if (matchedPattern) {
    const matches = dateTimeString.match(matchedPattern.regex);

    if (matches) {
      const isoDateString = matchedPattern.handler(matches);
      const parsedCustomDate = new Date(isoDateString);

      if (!Number.isNaN(parsedCustomDate.getTime())) {
        return parsedCustomDate.toISOString();
      }
    }
  }

  // If no valid format matched, throw an error
  throw new Error(`Invalid date format or unsupported date: ${dateTimeString}`);
}

// // Example usage:
// const testDates = [
  
//   "13-October-2024 14:38:59 GMT",
//   "13-10-2024 14:38:59 GMT",
//   "10/13/2024 14:38:59",
//   "2024-10-13 14:38:59",
//   "2024-10-13T14:38:59Z",
//   "13-10-2024",
//   "10/13/2024",
//   "2024-10-13",
//   "2024/10/13 14:38:59"
// ];

// testDates.forEach(date => {
//   try {
//     console.log(`${date} => ${formatDateTimeToISOString(date)}`);
//   } catch (error) {
//     console.error(`Error parsing date "${date}": ${error.message}`);
//   }
// });
