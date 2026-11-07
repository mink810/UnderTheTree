export function calculateAgeFromBirthYear(
  birthYear: number,
  referenceDate: Date = new Date()
): number {
  return referenceDate.getFullYear() - birthYear;
}

export function formatVerifiedAgeLabel(
  birthYear: number,
  referenceDate: Date = new Date()
): string {
  const age = calculateAgeFromBirthYear(birthYear, referenceDate);
  return `${age}세 (${birthYear}년생)`;
}
