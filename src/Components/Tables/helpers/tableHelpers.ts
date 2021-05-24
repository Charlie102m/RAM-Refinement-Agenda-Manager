/**
 * Converts camelCase string to normalised text in title case
 * @param str string to convert
 */
export const fromCamelCase = (str: string): string => {
  let strSplit = str.split(/(?=[A-Z])/);
  return strSplit?.length
    ? strSplit.reduce(
        (acc, next) =>
          acc + " " + next.charAt(0).toUpperCase() + next.substring(1),
        ""
      )
    : "";
};
