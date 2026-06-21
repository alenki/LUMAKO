/**
 * Renders a JSON-LD structured-data block. The `<` escape stops any string in the
 * data from breaking out of the <script> element. Server component - no client JS.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
