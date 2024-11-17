export const getNextDueDate = startDate => {
  const currentYear = new Date().getFullYear(); // Get the current year
  const date = new Date(startDate); // Convert startDate to Date object

  // Set the next due date to the current year
  const nextDueDate = new Date(date);
  nextDueDate.setFullYear(currentYear);

  // If the next due date has already passed (e.g., start date is later in the year), set it for the next year
  if (nextDueDate < new Date()) {
    nextDueDate.setFullYear(currentYear + 1);
  }

  // Get the day, month, and year components
  const day = String(nextDueDate.getDate()).padStart(2, '0'); // Ensure 2-digit day
  const month = String(nextDueDate.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
  const year = nextDueDate.getFullYear();

  // Return the formatted date as DD-MM-YYYY
  return `${day}-${month}-${year}`;
};

export const getFormatDate = startDate => {
  const date = new Date(startDate); // Convert startDate to Date object

  // Get the day, month, and year components
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
  const year = date.getFullYear();

  // Return the formatted date as DD-MM-YYYY
  return `${day}-${month}-${year}`;
};

export const getDayCountBetweenDates = nextDueDate => {
  console.log(nextDueDate);
  // Get today's date
  const today = new Date(); // No need to format today, we can use the Date object directly

  // Convert nextDueDate string to a Date object
  const dueDate = new Date(nextDueDate);

  // Get the difference in time (in milliseconds)
  const timeDifference = today.getTime() - dueDate.getTime();

  console.log(timeDifference);

  // Convert the time difference from milliseconds to days
  return Math.ceil(timeDifference / (1000 * 3600 * 24)); // Difference in days
};
