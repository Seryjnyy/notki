import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to pad single digit numbers with leading zero
function padZero(num: number) {
  return num.toString().padStart(2, "0");
}

function getMonthName(month: number) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1]; // Months are zero-indexed, so subtract 1
}

export function unixToTimestamp(val: number) {
  const date = new Date(val);

  // Get the individual components of the date
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formattedDate = `${day} ${getMonthName(month)} ${year}`;
  const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(
    seconds
  )}`;

  return `${formattedDate} ${formattedTime}`;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return bytes + " bytes";
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB";
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  }
}

// https://stackoverflow.com/a/6860916
export function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return "k" + S4() + S4() + "-" + S4() + "-" + S4();
}
