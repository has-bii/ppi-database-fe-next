import React from "react";

export default function SkeletonTable() {
  return (
    <div className="overflow-auto border border-black rounded-lg w-fit lg:w-full _hide_scrollbar">
      <table className="table-auto">
        <thead>
          <tr>
            <th scope="col">
              <span className="_skeleton"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="_skeleton"></span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="_skeleton"></span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="_skeleton"></span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="_skeleton"></span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="_skeleton"></span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="_skeleton"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
