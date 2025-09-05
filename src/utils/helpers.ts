export function combineClassNames(...classNames: string[]): string {
  return classNames.join(' ');
}

export function handleError(
  err: unknown,
  handler: (errText: string) => void
): void | never {
  console.error(err);

  if (err instanceof Error) {
    handler(err.message);
    return;
  }

  throw err;
}
