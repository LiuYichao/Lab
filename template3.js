// Patch a document with patches

import * as fs from "fs";
import {
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  Paragraph,
  patchDocument,
  PatchType,
  Table,
  TableCell,
  TableRow,
  TextDirection,
  TextRun,
  VerticalAlign,
  BorderStyle,
  WidthType,
  AlignmentType,
} from "docx";

// const path = require('path');
import path from "path";

const mockRows = [
  {
    id: "1",
    type: "1",
    angle: "1",
    localtion: "1",
    height: "1",
    depth: "1",
    gleason: "1",
  },
  {
    id: "2",
    type: "2",
    angle: "2",
    localtion: "2",
    height: "2",
    depth: "2",
    gleason: "2",
  },
];

const summary = {
  StartDate: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("20240909")],
  },
  EndDate: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("20240909")],
  },
  Val: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("1")],
  },
  Val1: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("Val1")],
  },
  Val2: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("Val2")],
  },
  Val3: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("Val3")],
  },
  Val4: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("Val4")],
  },
  Val5: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("Val5")],
  },
  Count: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("3")],
  },
  TarCount: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("2")],
  },
  SysCount: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("1")],
  },
  Dig2: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("Dig2")],
  },
};
const info = {
  idx: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("1")],
  },
  CaseNum: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("1234")],
  },
  Name: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("name")],
  },
  Age: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("1.1")],
  },
  Doctor: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("zhangsan")],
  },
  Hospital: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("hospital")],
  },
  Dep: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("Dep")],
  },
  RoomNo: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("RoomNo")],
  },
  PSA: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("PSA")],
  },
  fPSAtPSA: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("fPSAtPSA")],
  },
  Dig: {
    type: PatchType.PARAGRAPH,
    children: [new TextRun("Dig")],
  },
};
const borders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "4F94D4" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "4F94D4" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "4F94D4" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "4F94D4" },
};
const borders2 = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
};
const width = { size: 12.5, type: WidthType.PERCENTAGE };

const dataRows = function (rows) {
  const result = rows.map((e) => {
    return new TableRow({
      tableHeader: false,
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: e.id,
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: e.type,
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: e.angle,
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: e.localtion,
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: e.height,
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: e.depth,
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: e.gleason,
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
      ],
    });
  });

  return result;
};

const createTable = function () {
  const children = [];
  children.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "穿刺序号",
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
          background: {
            color: "C45911",
          },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "穿刺类型",
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "穿刺角度",
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "穿刺位置",
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "穿刺高度",
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "穿刺深度",
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Gleason评分",
                  bold: false,
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
          verticalAlign: VerticalAlign.CENTER,
          borders,
          width,
        }),
      ],
    })
  );
  const result = dataRows(mockRows);

  for (const r of result) {
    children.push(r);
  }

  return {
    type: PatchType.DOCUMENT,
    children: [
      new Table({
        rows: children,
      }),
    ],
  };
};

function toBase64(filePath) {
  const img = fs.readFileSync(filePath);
  return Buffer.from(img).toString("base64");
}

const createSumTable = function () {
  const imageData = toBase64("./template/BingWallpaper.jpg");
  return {
    type: PatchType.DOCUMENT,
    children: [
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "穿刺序号：",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 12.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "穿刺类型",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 87.5, type: WidthType.PERCENTAGE },
                columnSpan: 7,
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "穿刺类型：",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 12.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "1",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 5.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "穿刺角度：",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 12.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "2",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 5.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "穿刺位置：",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 12.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "3",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 5.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Gleason评分：",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 15.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "34",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 8.5, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "穿刺针道：",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 12.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "1",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 5.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "穿刺高度：",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 12.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "2",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 5.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "穿刺深度：",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 12.5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "2",
                        bold: false,
                        size: 18,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 12.5, type: WidthType.PERCENTAGE },
                columnSpan: 3,
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                        new ImageRun({
                            data: fs.readFileSync("./template/BingWallpaper.jpg"),
                            transformation: {
                                width: 100,
                                height: 100,
                            },
                        }),
                    ],
                }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 50, type: WidthType.PERCENTAGE },
                columnSpan: 5,
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                        new ImageRun({
                            data: fs.readFileSync("./template/BingWallpaper.jpg"),
                            transformation: {
                                width: 100,
                                height: 100,
                            },
                        }),
                    ],
                }),
                ],
                verticalAlign: VerticalAlign.CENTER,
                borders: borders2,
                width: { size: 50, type: WidthType.PERCENTAGE },
                columnSpan: 3,
              }),
            ],
          }),
        ],
      }),
    ],
  };
};

const patchTheDocument = async (data) => {
  const t = createTable();
  const t2 = createSumTable();
  return await patchDocument(data, {
    patches: {
      ...info,
      ...summary,
      table: t,
      tal: t2,
    },
  });
};

const baseDocxTemplate = fs.readFileSync("./template/template.docx");
const patchedDocxTemplate = await patchTheDocument(baseDocxTemplate);
fs.writeFileSync("template3.docx", patchedDocxTemplate);
