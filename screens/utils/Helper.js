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

export const getDayCountBetweenDates = inputDate => {
  const targetDate = getNextDueDate(inputDate);
  // Split the targetDate into day, month, and year
  const [day, month, year] = targetDate.split('-').map(Number);

  // Create a Date object for the target date
  const target = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

  // Get the current date
  const today = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = target - today;

  // Convert the difference to days
  const differenceInDays = Math.ceil(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  return differenceInDays;
};
