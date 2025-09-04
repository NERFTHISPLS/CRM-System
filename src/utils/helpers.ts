export function combineClassNames(...classNames: string[]): string {
  return classNames.join(' ');
}

export function formatError(errorMessage: string): string {
  return `Something went wrong: ${errorMessage}`;
}
