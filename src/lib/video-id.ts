function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

// Formats a moment as YYYYMMDD-HHMMSS in local time, e.g. 20261113-020411.
export function formatVideoId(moment: Date): string {
  const datePart = `${moment.getFullYear()}${padTwoDigits(moment.getMonth() + 1)}${padTwoDigits(moment.getDate())}`;
  const timePart = `${padTwoDigits(moment.getHours())}${padTwoDigits(moment.getMinutes())}${padTwoDigits(moment.getSeconds())}`;
  return `${datePart}-${timePart}`;
}

// Two videos added in the same second would clash, so the later one moves forward a second until its ID is free.
export function buildUniqueVideoId(timestampMilliseconds: number, takenVideoIds: Array<string | undefined>): string {
  let candidateTimestamp = timestampMilliseconds;
  let candidateId = formatVideoId(new Date(candidateTimestamp));

  while (takenVideoIds.includes(candidateId)) {
    candidateTimestamp += 1000;
    candidateId = formatVideoId(new Date(candidateTimestamp));
  }

  return candidateId;
}
