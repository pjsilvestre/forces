import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

const MapTile = ({ tile }) => (
  <td>
    {tile.type}
    <br />
    {tile.unit ? `${tile.unit.user.username}'s ${tile.unit.type}` : ''}
  </td>
);

const MapRow = ({ row }) => {
  const tiles = row.map((tile) => (
    <MapTile
      key={tile._id}
      tile={tile}
    />
  ));

  return (
    <tr>
      {tiles}
    </tr>
  );
};

function Map({ initialMatch }) {
  const [match, setMatch] = useState({});
  const [mapRows, setMapRows] = useState([]);

  const initializeMatch = async () => {
    if (!initialMatch) return;
    setMatch(initialMatch);
  };

  const initializeMapRows = async () => {
    if (!match) return;
    const { tiles } = match;
    if (!tiles) return;
    let rowIndex = -1;
    setMapRows(
      tiles.map((row) => {
        rowIndex += 1;
        return (
          <MapRow
            key={rowIndex}
            row={row}
          />
        );
      }),
    );
  };

  useEffect(() => {
    initializeMatch();
  }, [initialMatch]);

  useEffect(() => {
    initializeMapRows();
  }, [match]);

  if (!mapRows) {
    return (
      <h1>Loading...</h1>
    );
  }

  return (
    <Table>
      <tbody>
        {mapRows}
      </tbody>
    </Table>
  );
}

export default Map;