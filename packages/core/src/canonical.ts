export type CanonicalValue =
  | null
  | boolean
  | number
  | string
  | readonly CanonicalValue[]
  | { readonly [key: string]: CanonicalValue };

export type CanonicalizationErrorCode =
  | "UNSUPPORTED_TYPE"
  | "NON_FINITE_NUMBER"
  | "CYCLIC_REFERENCE"
  | "UNSUPPORTED_OBJECT"
  | "INVALID_KEY_ACCESS";

export interface CanonicalizationError {
  readonly code: CanonicalizationErrorCode;
  readonly path: string;
  readonly message: string;
}

export type CanonicalizeResult =
  | { readonly ok: true; readonly value: string }
  | { readonly ok: false; readonly error: CanonicalizationError };

function failure(
  code: CanonicalizationErrorCode,
  path: string,
  message: string,
): CanonicalizeResult {
  return { ok: false, error: { code, path, message } };
}

function isArrayIndex(key: string): boolean {
  if (key === "") return false;
  const value = Number(key);
  return Number.isSafeInteger(value) && value >= 0 && String(value) === key;
}

function serialize(
  input: unknown,
  path: string,
  ancestors: Set<object>,
): CanonicalizeResult {
  if (input === null) return { ok: true, value: "null" };

  switch (typeof input) {
    case "string":
      return { ok: true, value: JSON.stringify(input) };
    case "boolean":
      return { ok: true, value: input ? "true" : "false" };
    case "number":
      if (!Number.isFinite(input)) {
        return failure("NON_FINITE_NUMBER", path, "Canonical numbers must be finite.");
      }
      return { ok: true, value: JSON.stringify(Object.is(input, -0) ? 0 : input) };
    case "undefined":
    case "bigint":
    case "symbol":
    case "function":
      return failure("UNSUPPORTED_TYPE", path, `Unsupported canonical type: ${typeof input}.`);
    case "object":
      break;
    default:
      return failure("UNSUPPORTED_TYPE", path, "Unsupported canonical value.");
  }

  const object = input as object;
  if (ancestors.has(object)) {
    return failure("CYCLIC_REFERENCE", path, "Canonical values must be acyclic.");
  }

  ancestors.add(object);
  try {
    const descriptors = Object.getOwnPropertyDescriptors(object);
    const symbols = Object.getOwnPropertySymbols(object);
    if (symbols.length > 0) {
      return failure("UNSUPPORTED_OBJECT", path, "Symbol-keyed properties are not canonical.");
    }

    if (Array.isArray(object)) {
      const lengthDescriptor = descriptors.length;
      if (!lengthDescriptor || typeof lengthDescriptor.value !== "number") {
        return failure("INVALID_KEY_ACCESS", path, "Array length descriptor is invalid.");
      }

      const length = object.length;
      const values: string[] = [];
      for (let index = 0; index < length; index += 1) {
        const descriptor = descriptors[String(index)];
        if (!descriptor || !("value" in descriptor)) {
          return failure("UNSUPPORTED_OBJECT", `${path}[${index}]`, "Sparse/accessor arrays are not canonical.");
        }
        const result = serialize(descriptor.value, `${path}[${index}]`, ancestors);
        if (!result.ok) return result;
        values.push(result.value);
      }

      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (key === "length" || isArrayIndex(key)) continue;
        if (descriptor.enumerable) {
          return failure("UNSUPPORTED_OBJECT", path, `Array property ${key} is not canonical.`);
        }
      }

      return { ok: true, value: `[${values.join(",")}]` };
    }

    const prototype = Object.getPrototypeOf(object);
    if (prototype !== Object.prototype && prototype !== null) {
      return failure("UNSUPPORTED_OBJECT", path, "Only plain records are canonical objects.");
    }

    const keys = Object.keys(descriptors).sort();
    const fields: string[] = [];
    for (const key of keys) {
      const descriptor = descriptors[key];
      if (!descriptor) {
        return failure("INVALID_KEY_ACCESS", `${path}.${key}`, "Property descriptor disappeared.");
      }
      if (!descriptor.enumerable || !("value" in descriptor)) {
        return failure("UNSUPPORTED_OBJECT", `${path}.${key}`, "Only enumerable data properties are canonical.");
      }
      const result = serialize(descriptor.value, `${path}.${key}`, ancestors);
      if (!result.ok) return result;
      fields.push(`${JSON.stringify(key)}:${result.value}`);
    }
    return { ok: true, value: `{${fields.join(",")}}` };
  } catch {
    return failure("INVALID_KEY_ACCESS", path, "Canonical value could not be inspected safely.");
  } finally {
    ancestors.delete(object);
  }
}

export function canonicalize(input: unknown): CanonicalizeResult {
  return serialize(input, "$", new Set<object>());
}
