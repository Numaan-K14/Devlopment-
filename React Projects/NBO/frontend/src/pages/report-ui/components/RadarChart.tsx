import { ResponsiveRadar } from "@nivo/radar";

const RadarChart = ({
  data,
  keys,
  indexBy,
}: {
  data: any;
  keys: any;
  indexBy: string;
}) => (
  <div style={{ height: 350, width: 500 }}>
    <ResponsiveRadar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      curve='linearClosed'
      borderWidth={2}
      borderColor={{ from: "color" }}
      gridShape='linear'
      gridLabelOffset={24}
      enableDots={true}
      dotSize={6}
      dotColor='#1C9CF6'
      dotBorderWidth={1}
      dotBorderColor='#fff'
      colors={{ scheme: "nivo" }}
      fillOpacity={0.15}
      blendMode='multiply'
      enableDotLabel={false}
      theme={{
        axis: {
          ticks: {
            text: {
              fill: "#000",
              fontSize: 12,
            },
          },
          legend: {
            text: {
              fill: "#000",
              fontSize: 12,
            },
          },
        },
        labels: {
          text: {
            fill: "#1C9CF6",
            fontSize: 13,
            fontWeight: 500,
          },
        },
      }}
      legends={[]}
    />
  </div>
);

export default RadarChart;
