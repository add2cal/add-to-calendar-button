// SHARED FUNCTION TO GENERATE UUIDs
function generate_uuid(): string {
  //const id = crypto.randomUUID(); // lacking support of Safari < 15.4 and Firefox < 95, which is too important for now
  const id = (([1e7] as unknown as string) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => ((c as unknown as number) ^ (crypto.getRandomValues(new Uint8Array(1))[0]! & (15 >> ((c as unknown as number) / 4)))).toString(16));
  return id;
}

// SHARED FUNCTION TO TRANSFORM A STRING
function apply_transformation(value: unknown, transform?: string): unknown {
  if (!transform || !value) return value;
  switch (transform) {
    case 'upper':
      return (value as { toString(): string }).toString().toUpperCase();
    case 'lower':
      return (value as { toString(): string }).toString().toLowerCase();
    default:
      return value;
  }
}

export { generate_uuid, apply_transformation };
