import React from "react";
import PropTypes from "prop-types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

function PieChart({ data }) {
  return <Pie data={data} />;
}

PieChart.propTypes = {
  data: PropTypes.object.isRequired,
};

export default PieChart;
