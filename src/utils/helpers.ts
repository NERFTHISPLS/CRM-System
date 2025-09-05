export function combineClassNames(...classNames: string[]): string {
  return classNames.join(' ');
}

export function formatError(errorMessage: string): string {
  return `Something went wrong: ${errorMessage}`;
}

export function handleError(
  err: unknown,
  handler: (errText: string) => void
): void | never {
  console.error(err);

  if (err instanceof Error) {
    handler(formatError(err.message));
    return;
  }

  throw err;
}
