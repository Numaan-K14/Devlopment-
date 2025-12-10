import { ResponsiveBar } from "@nivo/bar";

interface CustomBarChartProps {
  data: Array<{ [key: string]: any }>;
  layout?: "horizontal" | "vertical";
  valueKey?: string;
  indexKey?: string;
  color?: string;
  height?: number | string;
  width?: number | string;
  enableGridX?: boolean;
  enableGridY?: boolean;
  marginLeft?: number;
  marginTop?: number;
  tickValue?: any[];
}

const CustomBarChart = ({
  data,
  layout = "horizontal",
  valueKey = "value",
  indexKey = "category",
  color,
  height = 300,
  width = 300,
  enableGridX = false,
  enableGridY = false,
  marginLeft = 30,
  marginTop = 5,
  tickValue,
}: CustomBarChartProps) => {
  console.log(data, "<------------ datat");

  console.log(tickValue, "<---------- ");
  return (
    <div style={{ height, background: "white", width }}>
      <ResponsiveBar
        data={data}
        indexBy='category'
        keys={["value"]}
        layout={layout}
        labelSkipHeight={2}
        labelSkipWidth={16}
        labelTextColor='white'
        enableLabel={true}
        // colors={color}
        colors={
          color
            ? color
            : // : (bar) => {
              //     const value = bar?.value || 0;
              //     if (value >= 4.5) return "#3786EE";
              //     if (value > 3.4 && value < 4.5) return "#92D050";
              //     if (value > 2.9 && value < 3.5) return "#FFCC00";
              //     if (value > 1.9 && value < 3.0) return "#FFCCFF";
              //     if (value >= 0 && value < 2.0) return "#FF0000";
              //     return "whilte";
              //   }

              (bar) => {
                const value = bar?.value || 0;

                if (value >= 4.5) return "#3786EE"; // Blue
                if (value >= 3.5 && value < 4.5) return "#92D050"; // Green
                if (value >= 2.5 && value < 3.5) return "#FFCC00"; // Yellow
                if (value >= 1.1 && value < 2.5) return "#FFCCFF"; // Pink
                if (value < 1.1 && value < 1.1) return "#FF0000"; // Pink

                return "white";
              }
        }
        margin={{
          top: marginTop,
          right: 0,
          bottom: 40,
          left: marginLeft,
        }}
        padding={0.5}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
          tickValues: tickValue,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 2,
          tickRotation: 0,
        }}
        borderRadius={2}
        theme={{
          axis: {
            ticks: {
              line: {
                stroke: "#ccc",
                strokeWidth: 0,
              },
              text: {
                fontSize: 10,
                fill: "#111",
              },
            },
          },
          grid: {
            line: {
              stroke: "#ddd",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            },
          },
        }}
        onClick={() => {}}
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
        enableGridY={enableGridY}
        enableGridX={enableGridX}
      />
    </div>
  );
};

export default CustomBarChart;
