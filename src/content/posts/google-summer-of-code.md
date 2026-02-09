---
title: Intelligent Alert System for HEP Experiments
date: 2nd Aug 2020
description: My Google Summer of Code 2020 project at CERN — building an intelligent monitoring solution for CMS distributed computing infrastructure.
---

![GSoC x CERN](/images/gsoc/gsoc_cern.png)

### Abstract

*from GSOC '20 project list.* [link](https://summerofcode.withgoogle.com/projects/#4648545665155072)

The project aims to develop an intelligent and reliable monitoring system for large distributed services, in order to monitor their status and reduce operational costs. The distributed computing infrastructure is the backbone of all computing activities of the CMS experiments at CERN. These distributed services include central services for authentication, workload management, data management, databases, etc.

Very large amounts of information are produced from this infrastructure. These include various anomalies, issues, outages, and those involving scheduled maintenance. The sheer volume and variety of information makes it too large to be handled by the operational team. Hence we aim to build an intelligent system that will detect, analyze and predict the abnormal behaviors of the infrastructure.

Quick Links: [GSOC](https://summerofcode.withgoogle.com/projects/#4648545665155072) | [CMSMonitoring](https://github.com/dmwm/CMSMonitoring) | [GSOC Progress Report](https://docs.google.com/document/d/1ATRWZLzsexHgdx73_PFwNGIUrUaudskSJ-FYnyZOHHw/edit?usp=sharing)

## Problem

"The growth of distributed services introduces a challenge to properly monitor their status and reduce operational costs."

The current monitoring system makes use of following tools:

- [ElasticSearch](https://www.elastic.co/elasticsearch/)
- [Kafka](https://kafka.apache.org/)
- [Grafana](https://grafana.com)
- [Prometheus](https://prometheus.io/)
- [AlertManager](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [VictoriaMetrics](https://victoriametrics.com/)
- Custom Solutions like GGUS, SSB system etc.

CMS infrastructure can produce significant amount of data on:

- various anomalies
- intermittent problems
- outages
- scheduled maintenance.

The operational teams deal with a large amount of alert notifications and tickets and generally they face difficulties in handling them manually (eg. visiting the web portals of GGUS and SSB to check alerts, manually silencing false alerts etc.).

So, in short, we need to automate the mundane process which allows op-teams to focus more on finding solutions for the source of alerts rather than searching, filtering and collecting the alerts and tickets.

## Solution

We propose an intelligent alert management system for the aforementioned problem.

**Aims:**

- detect tickets
- analyse tickets
- spot anomalies in tickets (if any)
- silence false alerts
- automate operation procedures

The system's abilities include, but are not limited to:

- Consuming tickets from various ticketing systems. ([GGUS](https://twiki.cern.ch/twiki/bin/view/LCG/GgusOperations) & [SSB](https://cern.service-now.com/service-portal?id=service_status_board) have been implemented). It is to be noted that being a modular architecture, there's always a scope to add more services in future.
- Extracting alerts relevant to the specific CMS services which get affected by such interventions.
- Intelligent grouping and ranking of the alerts.
- Silencing false alerts that start bombarding the system when a node goes down. So instead of logging multiple alerts from the services running on that node, we generate one single alert annotating that a specific node is down.
- Making them visible in the monitoring tools such as Grafana, Slack, Karma etc.

## Proposed Architecture

![Full Architecture](/images/gsoc/full_arch2.png)

The above diagram depicts the proposed architecture of the Intelligent Alert Management System.

The components which I developed are:

- Parser
- Alerting Module
- Alerting Service
- Intelligence Module
- Alert CLI Tool

Third-party tools being used are:

- [Grafana](https://grafana.com)
- [Prometheus](https://prometheus.io/)
- [AlertManager](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Slack](https://slack.com)
- [Karma](https://github.com/prymitive/karma)

All of these components been developed, are building blocks of the intelligent system. Let us discuss their implementation and features one by one.

## Parsers

AlertManager is an extensive tool for storing alerts from various sources. Prometheus, Grafana are the two most supported tools for AlertManager where you can simply define alert rules and you are good to go. Ticketing systems such as GGUS, SSB have their own dedicated platform for issueing tickets. These tickets provide useful insights to the operational teams to make important decisions when outages happen, therefore we would want them in the AlertManager. So far, there were no solutions other than using AlertManager API endpoints which give access to CRUD operations.

### GGUS

![GGUS parser diagram](/images/gsoc/ggus_parser.png)

GGUS Ticketing System web platform outputs data either in XML or CSV formats but Alertmanager requires data to be in specific JSON format. Hence, we developed a configurable parser which is capable of parsing both formats.

ggus_parser has two components:

- **parse** - parses the XML or CSV data from the GGUS Ticketing System web platform
- **convert** - converts the parsed data into JSON format and saves it to the disk.

Let's see an example

*GGUS Ticket (csv)*

```csv
Ticket-ID,Type,VO,Site,Priority,Resp. Unit,Status,Last Update,Subject,Scope
147196,USER,cms,FZK-LCG2,urgent,NGI_DE,assigned,2020-07-14,FZK-LCG2: issues on data access,WLCG
```

Above is a ticket in CSV format which is parsed and converted into...

*GGUS Parsed Ticket (JSON)*

```json
{
  "TicketID": 147196,
  "Type": "USER",
  "VO": "cms",
  "Site": "FZK-LCG2",
  "Priority": "urgent",
  "ResponsibleUnit": "NGI_DE",
  "Status": "assigned",
  "LastUpdate": "1590670920",
  "Subject": "FZK-LCG2: issues on data access",
  "Scope": "WLCG"
}
```

### SSB

![SSB parser diagram](/images/gsoc/monit.png)

What about SSB Ticketing System then?

There was no need of parser for SSB Ticketing System. monit tool was already developed by CMS team. It queries InfluxDB/ES data sources in MONIT via Grafana proxy. The SSB alerts in JSON format are printed on std output. We piped stdout to a .json file and saved it to the disk. This fulfills the goal of the parser.

Ref: [monit](https://github.com/dmwm/CMSMonitoring/blob/master/src/go/MONIT/monit.go)

Below is an example of such a query.

`monit -query=$query -dbname=$dbname -token=$token -dbid=$dbid > ssb_data.json`

So far we have developed the parser and found a way to convert both GGUS & SSB alerts to JSON files. But still we are far away from ingesting them to AlertManager. Let's see how we are doing it.

## Alerting Module

![Alerting module diagram](/images/gsoc/alert_mod.png)

### Building Blocks

- fetch
- convert
- post
- get
- delete

*now onwards we will call each ticket from GGUS/SSB as an alert

Let's discuss each block the alerting module is made up of.

- **fetch** - fetches saved JSON GGUS or SSB data from the disk (ggus_parser or monit). Maintains a hashmap for last seen alerts so that in future we ignore them to avoid multiple copies. Hashmap is a key, value data structure with fast lookup operation. Here key is alertname and value is the alert data.
- **convert** - fetched alerts are ingested here. Those alerts get converted to JSON data which AlertManager API understands.
- **post** - converted JSON data which contains GGUS/SSB alerts is pushed to AlertManager through AlertManager API endpoints.
- **get** - few GGUS/SSB alerts do not have Ending Time, that means it will need to be handled gracefully when they are resolved. So we automate the process of deleting those alerts from AlertManager when they are resolved at the origin. Fetches GGUS/SSB alerts from AlertManager. Now each fetched alert is checked to see if it is present in the HashMap. If it's available that means it hasn't been resolved yet. If it is not present in the Hashmap we deduce that the alert has been resolved and there's no need to keep it in the AlertManager. Bundles all resolved alerts.
- **delete** - all resolved alerts will now have End Time equal to present time. All open ending alerts in AlertManager get new End Time, i.e., they are deleted immediately.

## Alerting Service

![Alerting Service diagram](/images/gsoc/alert_srv.png)

Now we are familiar with the parser, alerting module and their functionalities. We will now integrate them to create an alerting service.

- Parser fetches data and saves it to disk
- Alerting module gets fetched data as input, converts it and pushes to AM.
- This whole process is bundled as a Linux Service with three commands: start, stop, status

**Components:**

- parser / monit
- alerting module

Alerting service is a linux service running both of these logics at a regular interval in the background.

**Configuration:**

- AlertManager URL
- Time Interval for the service
- HTTP Timeout
- Verbosity Level
- GGUS: Format, VO
- SSB: Query, Token

## AlertManager - One Place for All Alerts

![Diagram showing various sources pushing alerts to AM and admins interacting with AM with various tools.](/images/gsoc/am.png)

Alerting services which have been developed push GGUS & SSB alerts to AM at defined time intervals. Grafana & Prometheus push their alerts to AlertManager as well. AlertManager gives loads of features to handle alerts but it lacks proper UI. So, Karma Dashboard is used to fetch all alerts from AlertManager, and display them in a decent UI. Slack channels are configured to log alerts when they are fired in AlertManager.

AlertManager, Slack and Karma give all required info for alerts to our Operational teams.

## Use of Slack, Karma and Alert CLI Tool

### Slack

- Slack has defined channels for particular service alerts.
- Users are notified about fired alerts.
- AlertManager bots are at work.

![GGUS alerts in Slack](/images/gsoc/amTools/slack1.png)

![SSB alerts in Slack](/images/gsoc/amTools/slack2.png)

### Karma

- A dashboard which pulls all alerts from AlertManager.
- Availability of multi grids arrangement based on filters.
- More concise and better view than AlertManager.
- Wrote Dockerfile and Kubernetes config files.

![Karma Dashboard view-1](/images/gsoc/amTools/karma1.png)

![Karma Dashboard view-2](/images/gsoc/amTools/karma2.png)

### Alert CLI Tool

- Gives a nice and clean CLI interface for getting alerts, their details are printed on the terminal itself either in tabular form or JSON format.
- Convenient option for operators who prefer command line tools.
- Comes with several options such as: service, severity, tag (Filters), sort (Sorting), details (For detailed information of an alert), json (information in JSON format)

![Alert CLI Tool printing all alerts in the alertmanager of type SSB services sorted over duration](/images/gsoc/amTools/alert_tool1.png)

![Alert CLI Tool printing all alerts whose severity values are high](/images/gsoc/amTools/alert_tool2.png)

![Alert CLI Tool printing a specific alert in detail](/images/gsoc/amTools/alert_tool3.png)

![Alert CLI Tool printing a specific alert in detail in json format](/images/gsoc/amTools/alert_tool4.png)

## Intelligence Module

![Intelligence module diagram](/images/gsoc/int/int_mod.png)

It is a data pipeline. All components are independent of each other. One component receives the data, adds its logic and forwards the processed data to another component.

**Why data pipeline?**

- Low coupling
- Freedom of adding or removing components on demand.
- Power of concurrency

**What it does?**

- Assigns proper severity levels to SSB/GGUS alerts which helps operators to understand the criticality of the infrastructure. Ex. If Number of Alerts with severity="urgent" > some threshold, then the infrastructure is in critical situation.
- Annotates Grafana Dashboards when there are Network or Database interventions.
- Predicts the type of alerts and groups similar alerts with the help of Machine Learning.
- Adds applicable tutorial/instructions doc to alert, following which an operator can solve the issue quickly.
- Deletes old silences for those alerts which have open ending (such as GGUS alerts and some SSB alerts having no End time).

### Building Blocks

- Fetch Alerts
- Preprocessing
- Keyword Matching
- Add Annotations
- Machine Learning
- Push Alert
- Silence Alert
- Delete Old Silences

**Tools:** [Grafana](https://grafana.com) | [AlertManager](https://prometheus.io/docs/alerting/latest/alertmanager/)

### Fetch Alerts

![Fetch Alerts diagram](/images/gsoc/int/fetch_alerts.jpg)

- Fetches all alerts from AlertManager
- Bundles them and puts them on a channel.
- Channel (Analogy) - baggage belt at Airports. You put data into it, data will be picked up when required by other party.

### Preprocessing

![Preprocessing diagram](/images/gsoc/int/preprocessing.jpg)

- Filtering based on configuration.
- Only filtered alerts are forwarded.
- We also manage one map for keeping track of active silenced alerts to avoid redundant silences.
- If an alert is already silenced that means it has been processed by the intelligence module before.

### Keyword Matching

![Keyword Matching diagram](/images/gsoc/int/keyword_matching.png)

- Analysis of Alerts showed us repetitive use of a few important keywords.
- These keywords help in assigning severity levels.
- Searches for these keywords in alerts, if found we assign severity level mapped to that keyword.

### Add Annotations

![Add Annotations diagram](/images/gsoc/int/add_annotations.jpg)

- Grafana has dashboards which shows metrics of running services in the form of graphs.
- Grafana has add Annotation feature.
- SSB alert mentioning intervention in network / DB affects these services.
- Pushes such interventions info in the form of annotations into Grafana dashboards.

### Push Alert

![Push Alert diagram](/images/gsoc/int/push_alert.jpg)

- Alerts with modified information are pushed to AlertManager
- Incoming alerts are then forwarded to Silence Alert.

### Silence Alert

![Silence Alert diagram](/images/gsoc/int/silence_alert.png)

- Alerts which get modified and pushed to AlertManager get copied.
- Older alert is redundant
- Silences the older one for the duration of its lifetime.

### Delete Old Silences

![Delete Old Silences diagram](/images/gsoc/int/delete_old_silences.png)

- Alerts like GGUS & some SSB tickets have open ending time (That means we don't know for how long they will be in AM).
- So we wait for those alerts to get resolved, whenever they are resolved they are deleted from the AM by alerting services.
- But the silences will remain, right? So, this component takes care of such cases.
- It deletes those silences which get resolved.

## Future Work(s)

- Use of Machine Learning in intelligence module which will predict its severity info, priority and type. We can basically add logics into the MLBox component of intelligence module pipeline.

## Tools Used

- **Programming Language:** Go
- **Editors:** Vim, VS Code
- **Helper Tools:** GitHub, Git, golint, Photoshop, Google Docs, Google Slides

## Acknowledgements

I am thankful to my mentors for their invaluable guidance and support throughout my GSoC journey.

### Mentor Details

![profile:Valentin Kuznetsov — Cornell University (US) — vkuznet@protonmail.com](/images/gsoc/profile/valentin.jpeg)

![profile:Federica Legger — Universita e INFN Torino (IT) — federica.legger@to.infn.it](/images/gsoc/profile/legger.jpg)

![profile:Christian Ariza — Universidad de los Andes (CO) — christian.ariza@gmail.com](/images/gsoc/profile/christian.jpeg)

