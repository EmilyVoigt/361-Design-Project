// array storing scheduled class times for each day of the week

const classTimes = [
    {
      morning: { start: { hour: 8, minute: 30 }, end: { hour: 12, minute: 00 } },
      afternoon: {
        start: { hour: 13, minute: 30 },
        end: { hour: 15, minute: 30 },
      },
    },
    {
      morning: { start: { hour: 8, minute: 30 }, end: { hour: 12, minute: 30 } },
      afternoon: {
        start: { hour: 13, minute: 30 },
        end: { hour: 16, minute: 00 },
      },
    },
    {
      morning: { start: { hour: 8, minute: 30 }, end: { hour: 11, minute: 30 } },
      afternoon: {
        start: { hour: 12, minute: 30 },
        end: { hour: 16, minute: 00 },
      },
    },
    {
      morning: { start: { hour: 9, minute: 00 }, end: { hour: 12, minute: 30 } },
      afternoon: {
        start: { hour: 13, minute: 30 },
        end: { hour: 15, minute: 00 },
      },
    },
    {
      morning: { start: { hour: 0, minute: 00 }, end: { hour: 0, minute: 00 } },
      afternoon: { start: { hour: 0, minute: 00 }, end: { hour: 0, minute: 00 } },
    },
  ];