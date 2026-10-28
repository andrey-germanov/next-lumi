// Renders a title in the App Store slide format: "\n" breaks the line and
// [brackets] get the marker highlight (same strings as the slides use).
export default function MarkTitle({ text, marker = "#D6CCFF" }: { text: string; marker?: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} style={{ display: "block" }}>
          {line.split(/(\[[^\]]+\])/).map((part, j) =>
            part.startsWith("[") ? (
              <mark
                key={j}
                style={{
                  color: "inherit",
                  background: `linear-gradient(transparent 30%, ${marker} 30%, ${marker} 96%, transparent 96%)`,
                  borderRadius: 6,
                  padding: "0 0.1em",
                  margin: "0 -0.1em",
                  WebkitBoxDecorationBreak: "clone",
                  boxDecorationBreak: "clone",
                }}
              >
                {part.slice(1, -1)}
              </mark>
            ) : (
              part
            ),
          )}
        </span>
      ))}
    </>
  );
}
