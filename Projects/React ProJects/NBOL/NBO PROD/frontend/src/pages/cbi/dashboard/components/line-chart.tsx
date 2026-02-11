import { ResponsiveLine } from "@nivo/line";

const MyLineChart = ({
  height,
  weidth,
}: {
  height?: number;
  weidth?: number;
}) => {
  const data = [
    {
      id: "smooth-line",
      //   color: "url(#gradient)",
      color: "hsl(204, 70%, 50%)",
      data: [
        { x: 0, y: 10 },
        { x: 1, y: 15 },
        { x: 2, y: 5 },
        { x: 3, y: 20 },
        { x: 4, y: 8 },
        { x: 5, y: 14 },
        { x: 6, y: 10 },
      ],
    },
  ];

  return (
    <div style={{ height: height || 100, width: weidth || "100%" }}>
      <svg width='0' height='0'>
        <defs>
          <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop
              offset='0%'
              style={{
                stopColor: "hsl(204, 70%, 50%)",
                stopOpacity: 0.2,
              }}
            />
            <stop
              offset='100%'
              style={{
                stopColor: "hsl(60, 70%, 50%)", // Ending color (yellow)
                stopOpacity: 0.3, // Full opacity for the end of the area
              }}
            />
          </linearGradient>
        </defs>
      </svg>
      <ResponsiveLine
        data={data}
        margin={{ top: 1, right: 0, bottom: 0, left: 0 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        curve='catmullRom'
        axisBottom={{
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          legend: "",
          legendOffset: 0,
          legendPosition: "end",
          format: () => "",
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          legend: "",
          legendOffset: -40,
          legendPosition: "middle",
          format: () => "",
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={0}
        pointColor='hsl(204, 70%, 50%)'
        pointBorderWidth={2}
        pointBorderColor='#fff'
        enablePoints={false}
        useMesh={false}
        layers={["grid", "markers", "areas", "lines", "points"]}
        colors={(e: any) => e.color}
        enableArea={true}
        areaBlendMode='normal'
        areaOpacity={0.2}
      />
    </div>
  );
};

export default MyLineChart;
