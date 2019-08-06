import * as React from "react";

interface ComicProps {
  format?: string;
  series?: { name?: string };
  title?: string;
  creators?: { items?: Array<{ name?: string }> };
}

export default ({ format, title, series, creators }: ComicProps) => (
  <div
    style={{
      background: "#f5f5f5",
      margin: "10px 0",
      padding: "10px 20px",
      overflow: "scroll"
    }}
  >
    <h4>{title}</h4>
    <div>
      <strong>Series:</strong>
      &nbsp;{series.name}
    </div>
    <hr />
    <div>
      <strong>Format:</strong>
      &nbsp;{format}
    </div>
    <hr />
    <div>
      <div>
        <strong>Creators:</strong>
      </div>
      <ul>{creators.items.map(creator => <li>{creator.name}</li>)}</ul>
    </div>
  </div>
);
