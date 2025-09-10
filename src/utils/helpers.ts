export function combineClassNames(...classNames: string[]): string {
  return classNames.join(' ');
}

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === 'string') {
    return err;
  }

  return 'Failed to create task';
}
