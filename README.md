# SolarNetwork Node Datum Loader Example

This project is a basic NodeJS example CLI app that uses the `solarnetwork-datum-loader`
package to query SolarNetwork for a datum stream and print out the results.

For example, query for a week's worth of daily aggregate records:

```sh
node ./node-datum-loader.js -n 123 -s Main -b 2024-05-01T12:00 -e 2024-05-01T13:00 -a None

+--------------------------+----------+------------+-----------+-------+-----------+
|         created          | sourceId | localDate  | localTime | watts | wattHours |
+--------------------------+----------+------------+-----------+-------+-----------+
| 2024-05-01 00:01:37.004Z | Main     | 2024-05-01 | 12:01     |   648 |  41447970 |
| 2024-05-01 00:04:37.005Z | Main     | 2024-05-01 | 12:04     |   550 |  41448000 |
| 2024-05-01 00:07:37.005Z | Main     | 2024-05-01 | 12:07     |   478 |  41448030 |
| 2024-05-01 00:09:37.005Z | Main     | 2024-05-01 | 12:09     |   541 |  41448040 |
| 2024-05-01 00:12:37.005Z | Main     | 2024-05-01 | 12:12     |   504 |  41448070 |
| 2024-05-01 00:14:37.005Z | Main     | 2024-05-01 | 12:14     |   612 |  41448090 |
| 2024-05-01 00:17:37.005Z | Main     | 2024-05-01 | 12:17     |  1055 |  41448130 |
| 2024-05-01 00:19:37.005Z | Main     | 2024-05-01 | 12:19     |  1449 |  41448150 |
| 2024-05-01 00:22:37.005Z | Main     | 2024-05-01 | 12:22     |  2756 |  41448250 |
| 2024-05-01 00:24:37.005Z | Main     | 2024-05-01 | 12:24     |  1424 |  41448340 |
| 2024-05-01 00:27:37.005Z | Main     | 2024-05-01 | 12:27     |  1222 |  41448390 |
| 2024-05-01 00:30:37.006Z | Main     | 2024-05-01 | 12:30     |  2032 |  41448470 |
| 2024-05-01 00:33:37.007Z | Main     | 2024-05-01 | 12:33     |   583 |  41448550 |
| 2024-05-01 00:36:37.004Z | Main     | 2024-05-01 | 12:36     |  2021 |  41448600 |
| 2024-05-01 00:38:37.007Z | Main     | 2024-05-01 | 12:38     |  2446 |  41448640 |
| 2024-05-01 00:41:37.004Z | Main     | 2024-05-01 | 12:41     |  2526 |  41448760 |
| 2024-05-01 00:43:37.007Z | Main     | 2024-05-01 | 12:43     |  2047 |  41448830 |
| 2024-05-01 00:46:37.003Z | Main     | 2024-05-01 | 12:46     |  1401 |  41448920 |
| 2024-05-01 00:48:37.007Z | Main     | 2024-05-01 | 12:48     |  1282 |  41448960 |
| 2024-05-01 00:51:37.003Z | Main     | 2024-05-01 | 12:51     |   938 |  41449020 |
| 2024-05-01 00:53:37.007Z | Main     | 2024-05-01 | 12:53     |   958 |  41449050 |
| 2024-05-01 00:56:37.003Z | Main     | 2024-05-01 | 12:56     |  1476 |  41449110 |
| 2024-05-01 00:58:37.007Z | Main     | 2024-05-01 | 12:58     |  1416 |  41449180 |
+--------------------------+----------+------------+-----------+-------+-----------+

23 results returned.
```

# Usage

```
Usage: node node-datum-loader.js [OPTIONS]

Execute a SolarQuery datum query and show the results.

  -n, --node=ARG       node ID
  -s, --source=ARG+    source ID
  -b, --begin-date=ARG local begin date, in YYYY-MM-DD HH:mm or YYYY-MM-DD format
  -e, --end-date=ARG   local end date, exclusive
  -a, --aggregate=ARG  aggregate, e.g. None, Hour, Day, Month (defaults to Day)
  -t, --token=ARG      a SolarNet token to use
  -S, --secret=ARG     the SolarNet token secret to use
  -h, --help           show this help
```

The `-s/--source` argument may be specified any number of times to load multiple source IDs.
