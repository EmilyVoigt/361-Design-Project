//summer is june 21 to spetember 22

//webscraper script to get sunrise sunset data
// https://sunrise-sunset.org/search?location=kitchener 

// let days = document.querySelectorAll("tr.day");
// let formattedDays = [];

// days.forEach((day) => {
//   let date = day.children[0].children[0].innerHTML;
//   let sunsetTime = day.children[3].children[0].innerHTML;
//   let sunriseTime = day.children[2].children[0].innerHTML;

//   formattedDays.push({ date: date, sunset: sunsetTime, sunrise: sunriseTime });
// });

// console.log(formattedDays);

const julyData = [
    {
      date: "Fri, Jul 1",
      sunset: "9:08:18 pm",
      sunrise: "5:43:30 am",
    },
    {
      date: "Sat, Jul 2",
      sunset: "9:08:07 pm",
      sunrise: "5:44:03 am",
    },
    {
      date: "Sun, Jul 3",
      sunset: "9:07:54 pm",
      sunrise: "5:44:39 am",
    },
    {
      date: "Mon, Jul 4",
      sunset: "9:07:39 pm",
      sunrise: "5:45:15 am",
    },
    {
      date: "Tue, Jul 5",
      sunset: "9:07:21 pm",
      sunrise: "5:45:54 am",
    },
    {
      date: "Wed, Jul 6",
      sunset: "9:07:01 pm",
      sunrise: "5:46:34 am",
    },
    {
      date: "Thu, Jul 7",
      sunset: "9:06:39 pm",
      sunrise: "5:47:16 am",
    },
    {
      date: "Fri, Jul 8",
      sunset: "9:06:15 pm",
      sunrise: "5:47:58 am",
    },
    {
      date: "Sat, Jul 9",
      sunset: "9:05:48 pm",
      sunrise: "5:48:43 am",
    },
    {
      date: "Sun, Jul 10",
      sunset: "9:05:19 pm",
      sunrise: "5:49:29 am",
    },
    {
      date: "Mon, Jul 11",
      sunset: "9:04:48 pm",
      sunrise: "5:50:16 am",
    },
    {
      date: "Tue, Jul 12",
      sunset: "9:04:15 pm",
      sunrise: "5:51:04 am",
    },
    {
      date: "Wed, Jul 13",
      sunset: "9:03:40 pm",
      sunrise: "5:51:54 am",
    },
    {
      date: "Thu, Jul 14",
      sunset: "9:03:03 pm",
      sunrise: "5:52:44 am",
    },
    {
      date: "Fri, Jul 15",
      sunset: "9:02:23 pm",
      sunrise: "5:53:36 am",
    },
    {
      date: "Sat, Jul 16",
      sunset: "9:01:41 pm",
      sunrise: "5:54:29 am",
    },
    {
      date: "Sun, Jul 17",
      sunset: "9:00:58 pm",
      sunrise: "5:55:23 am",
    },
    {
      date: "Mon, Jul 18",
      sunset: "9:00:12 pm",
      sunrise: "5:56:18 am",
    },
    {
      date: "Tue, Jul 19",
      sunset: "8:59:24 pm",
      sunrise: "5:57:14 am",
    },
    {
      date: "Wed, Jul 20",
      sunset: "8:58:34 pm",
      sunrise: "5:58:10 am",
    },
    {
      date: "Thu, Jul 21",
      sunset: "8:57:43 pm",
      sunrise: "5:59:08 am",
    },
    {
      date: "Fri, Jul 22",
      sunset: "8:56:49 pm",
      sunrise: "6:00:06 am",
    },
    {
      date: "Sat, Jul 23",
      sunset: "8:55:53 pm",
      sunrise: "6:01:05 am",
    },
    {
      date: "Sun, Jul 24",
      sunset: "8:54:56 pm",
      sunrise: "6:02:05 am",
    },
    {
      date: "Mon, Jul 25",
      sunset: "8:53:57 pm",
      sunrise: "6:03:06 am",
    },
    {
      date: "Tue, Jul 26",
      sunset: "8:52:56 pm",
      sunrise: "6:04:07 am",
    },
    {
      date: "Wed, Jul 27",
      sunset: "8:51:53 pm",
      sunrise: "6:05:08 am",
    },
    {
      date: "Thu, Jul 28",
      sunset: "8:50:48 pm",
      sunrise: "6:06:11 am",
    },
    {
      date: "Fri, Jul 29",
      sunset: "8:49:41 pm",
      sunrise: "6:07:13 am",
    },
    {
      date: "Sat, Jul 30",
      sunset: "8:48:33 pm",
      sunrise: "6:08:17 am",
    },
    {
      date: "Sun, Jul 31",
      sunset: "8:47:24 pm",
      sunrise: "6:09:20 am",
    },
  ];
  
  const augustData = [
    {
      date: "Mon, Aug 1",
      sunset: "8:46:12 pm",
      sunrise: "6:10:24 am",
    },
    {
      date: "Tue, Aug 2",
      sunset: "8:44:59 pm",
      sunrise: "6:11:29 am",
    },
    {
      date: "Wed, Aug 3",
      sunset: "8:43:45 pm",
      sunrise: "6:12:34 am",
    },
    {
      date: "Thu, Aug 4",
      sunset: "8:42:29 pm",
      sunrise: "6:13:39 am",
    },
    {
      date: "Fri, Aug 5",
      sunset: "8:41:11 pm",
      sunrise: "6:14:44 am",
    },
    {
      date: "Sat, Aug 6",
      sunset: "8:39:52 pm",
      sunrise: "6:15:50 am",
    },
    {
      date: "Sun, Aug 7",
      sunset: "8:38:32 pm",
      sunrise: "6:16:56 am",
    },
    {
      date: "Mon, Aug 8",
      sunset: "8:37:10 pm",
      sunrise: "6:18:02 am",
    },
    {
      date: "Tue, Aug 9",
      sunset: "8:35:47 pm",
      sunrise: "6:19:08 am",
    },
    {
      date: "Wed, Aug 10",
      sunset: "8:34:23 pm",
      sunrise: "6:20:14 am",
    },
    {
      date: "Thu, Aug 11",
      sunset: "8:32:57 pm",
      sunrise: "6:21:21 am",
    },
    {
      date: "Fri, Aug 12",
      sunset: "8:31:30 pm",
      sunrise: "6:22:28 am",
    },
    {
      date: "Sat, Aug 13",
      sunset: "8:30:02 pm",
      sunrise: "6:23:34 am",
    },
    {
      date: "Sun, Aug 14",
      sunset: "8:28:33 pm",
      sunrise: "6:24:41 am",
    },
    {
      date: "Mon, Aug 15",
      sunset: "8:27:02 pm",
      sunrise: "6:25:48 am",
    },
    {
      date: "Tue, Aug 16",
      sunset: "8:25:31 pm",
      sunrise: "6:26:55 am",
    },
    {
      date: "Wed, Aug 17",
      sunset: "8:23:58 pm",
      sunrise: "6:28:02 am",
    },
    {
      date: "Thu, Aug 18",
      sunset: "8:22:24 pm",
      sunrise: "6:29:09 am",
    },
    {
      date: "Fri, Aug 19",
      sunset: "8:20:50 pm",
      sunrise: "6:30:16 am",
    },
    {
      date: "Sat, Aug 20",
      sunset: "8:19:14 pm",
      sunrise: "6:31:23 am",
    },
    {
      date: "Sun, Aug 21",
      sunset: "8:17:37 pm",
      sunrise: "6:32:30 am",
    },
    {
      date: "Mon, Aug 22",
      sunset: "8:16:00 pm",
      sunrise: "6:33:37 am",
    },
    {
      date: "Tue, Aug 23",
      sunset: "8:14:22 pm",
      sunrise: "6:34:44 am",
    },
    {
      date: "Wed, Aug 24",
      sunset: "8:12:43 pm",
      sunrise: "6:35:51 am",
    },
    {
      date: "Thu, Aug 25",
      sunset: "8:11:03 pm",
      sunrise: "6:36:58 am",
    },
    {
      date: "Fri, Aug 26",
      sunset: "8:09:22 pm",
      sunrise: "6:38:05 am",
    },
    {
      date: "Sat, Aug 27",
      sunset: "8:07:40 pm",
      sunrise: "6:39:11 am",
    },
    {
      date: "Sun, Aug 28",
      sunset: "8:05:58 pm",
      sunrise: "6:40:18 am",
    },
    {
      date: "Mon, Aug 29",
      sunset: "8:04:15 pm",
      sunrise: "6:41:25 am",
    },
    {
      date: "Tue, Aug 30",
      sunset: "8:02:32 pm",
      sunrise: "6:42:32 am",
    },
    {
      date: "Wed, Aug 31",
      sunset: "8:00:48 pm",
      sunrise: "6:43:38 am",
    },
  ];
  
  const septemberData = [
    {
      date: "Thu, Sep 1",
      sunset: "7:59:03 pm",
      sunrise: "6:44:45 am",
    },
    {
      date: "Fri, Sep 2",
      sunset: "7:57:18 pm",
      sunrise: "6:45:52 am",
    },
    {
      date: "Sat, Sep 3",
      sunset: "7:55:32 pm",
      sunrise: "6:46:58 am",
    },
    {
      date: "Sun, Sep 4",
      sunset: "7:53:46 pm",
      sunrise: "6:48:05 am",
    },
    {
      date: "Mon, Sep 5",
      sunset: "7:52:00 pm",
      sunrise: "6:49:11 am",
    },
    {
      date: "Tue, Sep 6",
      sunset: "7:50:12 pm",
      sunrise: "6:50:18 am",
    },
    {
      date: "Wed, Sep 7",
      sunset: "7:48:25 pm",
      sunrise: "6:51:24 am",
    },
    {
      date: "Thu, Sep 8",
      sunset: "7:46:37 pm",
      sunrise: "6:52:31 am",
    },
    {
      date: "Fri, Sep 9",
      sunset: "7:44:49 pm",
      sunrise: "6:53:37 am",
    },
    {
      date: "Sat, Sep 10",
      sunset: "7:43:01 pm",
      sunrise: "6:54:44 am",
    },
    {
      date: "Sun, Sep 11",
      sunset: "7:41:12 pm",
      sunrise: "6:55:50 am",
    },
    {
      date: "Mon, Sep 12",
      sunset: "7:39:23 pm",
      sunrise: "6:56:57 am",
    },
    {
      date: "Tue, Sep 13",
      sunset: "7:37:34 pm",
      sunrise: "6:58:03 am",
    },
    {
      date: "Wed, Sep 14",
      sunset: "7:35:45 pm",
      sunrise: "6:59:10 am",
    },
    {
      date: "Thu, Sep 15",
      sunset: "7:33:55 pm",
      sunrise: "7:00:16 am",
    },
    {
      date: "Fri, Sep 16",
      sunset: "7:32:05 pm",
      sunrise: "7:01:23 am",
    },
    {
      date: "Sat, Sep 17",
      sunset: "7:30:16 pm",
      sunrise: "7:02:30 am",
    },
    {
      date: "Sun, Sep 18",
      sunset: "7:28:26 pm",
      sunrise: "7:03:37 am",
    },
    {
      date: "Mon, Sep 19",
      sunset: "7:26:36 pm",
      sunrise: "7:04:44 am",
    },
    {
      date: "Tue, Sep 20",
      sunset: "7:24:47 pm",
      sunrise: "7:05:51 am",
    },
    {
      date: "Wed, Sep 21",
      sunset: "7:22:57 pm",
      sunrise: "7:06:58 am",
    },
    {
      date: "Thu, Sep 22",
      sunset: "7:21:07 pm",
      sunrise: "7:08:05 am",
    },
    {
      date: "Fri, Sep 23",
      sunset: "7:19:18 pm",
      sunrise: "7:09:13 am",
    },
    {
      date: "Sat, Sep 24",
      sunset: "7:17:28 pm",
      sunrise: "7:10:20 am",
    },
    {
      date: "Sun, Sep 25",
      sunset: "7:15:39 pm",
      sunrise: "7:11:28 am",
    },
    {
      date: "Mon, Sep 26",
      sunset: "7:13:50 pm",
      sunrise: "7:12:36 am",
    },
    {
      date: "Tue, Sep 27",
      sunset: "7:12:01 pm",
      sunrise: "7:13:44 am",
    },
    {
      date: "Wed, Sep 28",
      sunset: "7:10:12 pm",
      sunrise: "7:14:52 am",
    },
    {
      date: "Thu, Sep 29",
      sunset: "7:08:24 pm",
      sunrise: "7:16:01 am",
    },
    {
      date: "Fri, Sep 30",
      sunset: "7:06:36 pm",
      sunrise: "7:17:09 am",
    },
  ];
  
  const juneData = [
    {
      date: "Wed, Jun 1",
      sunset: "8:57:33 pm",
      sunrise: "5:42:09 am",
    },
    {
      date: "Thu, Jun 2",
      sunset: "8:58:21 pm",
      sunrise: "5:41:41 am",
    },
    {
      date: "Fri, Jun 3",
      sunset: "8:59:07 pm",
      sunrise: "5:41:14 am",
    },
    {
      date: "Sat, Jun 4",
      sunset: "8:59:51 pm",
      sunrise: "5:40:50 am",
    },
    {
      date: "Sun, Jun 5",
      sunset: "9:00:35 pm",
      sunrise: "5:40:28 am",
    },
    {
      date: "Mon, Jun 6",
      sunset: "9:01:16 pm",
      sunrise: "5:40:08 am",
    },
    {
      date: "Tue, Jun 7",
      sunset: "9:01:56 pm",
      sunrise: "5:39:51 am",
    },
    {
      date: "Wed, Jun 8",
      sunset: "9:02:35 pm",
      sunrise: "5:39:35 am",
    },
    {
      date: "Thu, Jun 9",
      sunset: "9:03:11 pm",
      sunrise: "5:39:22 am",
    },
    {
      date: "Fri, Jun 10",
      sunset: "9:03:46 pm",
      sunrise: "5:39:11 am",
    },
    {
      date: "Sat, Jun 11",
      sunset: "9:04:19 pm",
      sunrise: "5:39:02 am",
    },
    {
      date: "Sun, Jun 12",
      sunset: "9:04:51 pm",
      sunrise: "5:38:56 am",
    },
    {
      date: "Mon, Jun 13",
      sunset: "9:05:20 pm",
      sunrise: "5:38:51 am",
    },
    {
      date: "Tue, Jun 14",
      sunset: "9:05:48 pm",
      sunrise: "5:38:49 am",
    },
    {
      date: "Wed, Jun 15",
      sunset: "9:06:13 pm",
      sunrise: "5:38:49 am",
    },
    {
      date: "Thu, Jun 16",
      sunset: "9:06:37 pm",
      sunrise: "5:38:51 am",
    },
    {
      date: "Fri, Jun 17",
      sunset: "9:06:59 pm",
      sunrise: "5:38:56 am",
    },
    {
      date: "Sat, Jun 18",
      sunset: "9:07:18 pm",
      sunrise: "5:39:02 am",
    },
    {
      date: "Sun, Jun 19",
      sunset: "9:07:36 pm",
      sunrise: "5:39:11 am",
    },
    {
      date: "Mon, Jun 20",
      sunset: "9:07:51 pm",
      sunrise: "5:39:21 am",
    },
    {
      date: "Tue, Jun 21",
      sunset: "9:08:05 pm",
      sunrise: "5:39:34 am",
    },
    {
      date: "Wed, Jun 22",
      sunset: "9:08:16 pm",
      sunrise: "5:39:49 am",
    },
    {
      date: "Thu, Jun 23",
      sunset: "9:08:25 pm",
      sunrise: "5:40:06 am",
    },
    {
      date: "Fri, Jun 24",
      sunset: "9:08:32 pm",
      sunrise: "5:40:25 am",
    },
    {
      date: "Sat, Jun 25",
      sunset: "9:08:37 pm",
      sunrise: "5:40:45 am",
    },
    {
      date: "Sun, Jun 26",
      sunset: "9:08:39 pm",
      sunrise: "5:41:08 am",
    },
    {
      date: "Mon, Jun 27",
      sunset: "9:08:40 pm",
      sunrise: "5:41:33 am",
    },
    {
      date: "Tue, Jun 28",
      sunset: "9:08:38 pm",
      sunrise: "5:41:59 am",
    },
    {
      date: "Wed, Jun 29",
      sunset: "9:08:33 pm",
      sunrise: "5:42:28 am",
    },
    {
      date: "Thu, Jun 30",
      sunset: "9:08:27 pm",
      sunrise: "5:42:58 am",
    },
  ];
  