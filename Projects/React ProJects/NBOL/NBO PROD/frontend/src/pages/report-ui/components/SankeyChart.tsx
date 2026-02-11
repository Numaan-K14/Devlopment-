import { ResponsiveSankey } from "@nivo/sankey";

const SankeyChart = ({ Data }: any) => {
  // const data = {
  //   nodes: [
  //     {
  //       id: "3.8",
  //     },

  //     {
  //       id: "C1",
  //     },
  //     {
  //       id: "C2",
  //     },
  //     {
  //       id: "C3",
  //     },
  //     {
  //       id: "C4",
  //     },
  //     {
  //       id: "C5",
  //     },

  //     {
  //       id: "C6",
  //     },
  //   ],
  //   links: [
  //     {
  //       source: "C1",
  //       target: "3.8",
  //       value: 22069.349,
  //     },
  //     {
  //       source: "C2",
  //       target: "3.8",
  //       value: 16495.151,
  //     },
  //     {
  //       source: "C3",
  //       target: "3.8",
  //       value: 1683.656,
  //     },
  //     {
  //       source: "C4",
  //       target: "3.8",
  //       value: 1683.656,
  //     },
  //     {
  //       source: "C5",
  //       target: "3.8",
  //       value: 16495.151,
  //     },
  //     {
  //       source: "C6",
  //       target: "3.8",
  //       value: 1008.01,
  //     },
  //   ],
  // };

  return (
    <div style={{ height: 324.44677734375, width: 383 }}>
      <ResponsiveSankey
        data={Data}
        margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
        align='justify'
        colors={{ scheme: "category10" }}
        nodeOpacity={1}
        nodeThickness={15}
        nodeInnerPadding={3}
        nodeSpacing={10}
        nodeBorderWidth={0}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        linkOpacity={0.5}
        linkHoverOthersOpacity={0.1}
        enableLinkGradient={true}
        labelPosition='outside'
        labelPadding={6}
        labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
        animate={true}
        // motionStiffness={140}
        // motionDamping={13}
      />
    </div>
  );
};

export default SankeyChart;
