import { filterData, buildProperty } from "../useFilter";

const seriesNames = [
  "Cap Transport (2005 - 2006)",
  "Amazing Spider-Man 500 Covers Slipcase - Book II (2003)"
];

const creators = [
  "Tom Brevoort",
  "Molly Lazer",
  "Andy Schmidt",
  "Ed Brubaker",
  "Vc Joe Caramagna",
  "Frank D'ARMATA",
  "Steve Epting",
  "Michael Lark",
  "Mark Paniccia",
  "Keith Giffen"
];

describe("#filterData", () => {
  const items = [
    {
      format: "Digest",
      series: {
        resourceURI: "http://gateway.marvel.com/v1/public/series/2722",
        name: "Amazing Spider-Man 500 Covers Slipcase - Book II (2003)"
      },
      creators: {
        available: 8,
        collectionURI:
          "http://gateway.marvel.com/v1/public/comics/16232/creators",
        items: [
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/2133",
            name: "Tom Brevoort",
            role: "editor"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/5248",
            name: "Molly Lazer",
            role: "editor"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/4371",
            name: "Andy Schmidt",
            role: "editor"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/367",
            name: "Ed Brubaker",
            role: "writer"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/5251",
            name: "Vc Joe Caramagna",
            role: "letterer"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/8504",
            name: "Frank D'ARMATA",
            role: "colorist"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/374",
            name: "Steve Epting",
            role: "penciler"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/509",
            name: "Michael Lark",
            role: "penciler"
          }
        ],
        returned: 8
      }
    },
    {
      format: "Comic",
      series: {
        resourceURI: "http://gateway.marvel.com/v1/public/series/2722",
        name: "Cap Transport (2005 - 2006)"
      },
      creators: {
        available: 14,
        collectionURI:
          "http://gateway.marvel.com/v1/public/comics/16230/creators",
        items: [
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/4600",
            name: "Mark Paniccia",
            role: "editor"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/4371",
            name: "Andy Schmidt",
            role: "editor"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/367",
            name: "Ed Brubaker",
            role: "writer"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/400",
            name: "Keith Giffen",
            role: "writer"
          },
          {
            resourceURI: "http://gateway.marvel.com/v1/public/creators/8504",
            name: "Frank D'ARMATA",
            role: "colorist"
          }
        ],
        returned: 14
      }
    }
  ];

  test("doesn't filter anything out when there are no filters selected", () => {
    expect(filterData(items, [], [])).toEqual(items);
  });

  test("filters by a basic 1 layered filter (without properties)", () => {
    expect(
      filterData(
        items,
        [{ key: "format", value: "Digest" }],
        [{ key: "format", values: ["Comic", "Trade Paperback", "Digest"] }]
      )
    ).toEqual([items[0]]);
  });

  test("filters by AND logic", () => {
    expect(
      filterData(
        items,
        [{ key: "format", value: "Digest" }, { key: "format", value: "Comic" }],
        [{ key: "format", values: ["Comic", "Trade Paperback", "Digest"] }]
      )
    ).toEqual([]);
  });

  test("filters by a 2 layered property", () => {
    expect(
      filterData(
        items,
        [{ key: "series", value: "Cap Transport (2005 - 2006)" }],
        [
          {
            key: "series",
            values: [
              "Amazing Spider-Man 500 Covers Slipcase - Book II (2003)",
              "Cap Transport (2005 - 2006)"
            ],
            properties: ["name"]
          }
        ]
      )
    ).toEqual([items[1]]);
  });

  test("filters by a multi layered property with an array", () => {
    expect(
      filterData(
        items,
        [{ key: "creators", value: "Keith Giffen" }],
        [
          {
            key: "creators",
            values: creators,
            properties: ["items", "name"]
          }
        ]
      )
    ).toEqual([items[1]]);
  });

  test("filters by a multi layered property with an array with multiple selections", () => {
    expect(
      filterData(
        items,
        [
          { key: "creators", value: "Keith Giffen" },
          { key: "creators", value: "Andy Schmidt" }
        ],
        [
          {
            key: "creators",
            values: creators,
            properties: ["items", "name"]
          }
        ]
      )
    ).toEqual([items[1]]);
  });

  test("filters with multiple selections", () => {
    expect(
      filterData(
        items,
        [
          { key: "creators", value: "Keith Giffen" },
          { key: "series", value: "Cap Transport (2005 - 2006)" }
        ],
        [
          {
            key: "creators",
            values: creators,
            properties: ["items", "name"]
          },
          {
            key: "series",
            values: [
              "Amazing Spider-Man 500 Covers Slipcase - Book II (2003)",
              "Cap Transport (2005 - 2006)"
            ],
            properties: ["name"]
          }
        ]
      )
    ).toEqual([items[1]]);
  });
});

describe("#buildProperty", () => {
  const itemOne = {
    series: {
      resourceURI: "http://gateway.marvel.com/v1/public/series/2722",
      name: "Cap Transport (2005 - 2006)"
    }
  };

  const itemTwo = {
    one: {
      test: {
        tis: [{ out: 1 }, { out: 2 }]
      }
    }
  };

  const itemThree = {
    one: {
      test: {
        tis: {
          out: 1
        }
      }
    }
  };

  test("should build the property by traversing an array of properties at one level", () => {
    const facet = { key: "series", values: seriesNames, properties: ["name"] };
    const filter = {
      key: "series",
      value: "Cap Transport (2005 - 2006)"
    };

    expect(buildProperty(itemOne, facet.properties, filter.key)).toEqual(
      "Cap Transport (2005 - 2006)"
    );
  });

  test("should return  the value from a multilevel object traversal", () => {
    const facet = {
      key: "one",
      values: seriesNames,
      properties: ["test", "tis", "out"]
    };
    const filter = { key: "one" };

    expect(buildProperty(itemThree, facet.properties, filter.key)).toEqual(1);
  });

  test("should build the property by traversing an array of properties at two levels", () => {
    const facet = {
      key: "one",
      values: seriesNames,
      properties: ["test", "tis", "out"]
    };
    const filter = { key: "one" };

    expect(buildProperty(itemTwo, facet.properties, filter.key)).toEqual([
      1,
      2
    ]);
  });
});
