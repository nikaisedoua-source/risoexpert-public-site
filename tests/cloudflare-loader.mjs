const mock = `data:text/javascript,${encodeURIComponent("export const env = {};")}`;

export function resolve(specifier, context, nextResolve) {
  if (specifier === "cloudflare:workers") {
    return { url: mock, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
