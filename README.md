# Datapad Backend Assessment

## Introduction

I made this project to show my skills and knowledge in backend development.

### How to run

1. Clone the repository
2. Rename example.env to .env and fill the variables
3. Run `docker compose up --build` for the first time
4. Run `docker compose up` for the next times

Data Source: [Google Spreadsheets](https://docs.google.com/spreadsheets/d/1frVzuJCImzpP-zEhSrzuQGV0rUp3mFxV5OfG0z1UZYg/edit?usp=sharing)

#### Metrics

- Avg. Revenue by Brand
- Weekly Sessions
- Daily Conversion Rate %
- Net Revenue of Each Customer

### API Schema

#### Avg. Revenue by Brand

Request:

```http
GET /metrics?id=revenue&dimensions=brand&aggregate=avg
```

Response:

```http
{
  "metric": "revenue",
  "dimensions": ["brand"],
  "aggregation": "avg",
  "data": {
    "Nike": [
      {
        "value": "1.23"
      }
    ],
    "Samsung": [
      {
        "value": "2.00"
      }
    ],
    "Apple": [
      {
        "value": "3.00"
      }
    ]
  }
}
```

#### Weekly Sessions

Request:

```http
GET /metrics?id=sessions&dimensions=date.weeknum&aggregate=distinct
```

Response:

```http
{
  "metric": "sessions",
  "dimensions": ["date.weeknum"],
  "aggregation": "distinct",
  "data": {
    "49": [
      {
        "value": "2342"
      }
    ],
    "50": [
      {
        "value": "2322"
      }
    ],
    "51": [
      {
        "value": "1643"
      }
    ],
    "52": [
      {
        "value": "34"
      }
    ]
  }
}
```

#### Daily Conversion Date %

Request:

```http
GET /metrics?id=conversion&dimensions=date&aggregate=distinct
```

Response:

```http
{
  "metric": "conversion",
  "dimensions": ["date"],
  "aggregation": "distinct",
  "data": {
    "2020-10-09": [
      {
        "sessions": 100,
        "purchases": 10,
        "value": "10.00"
      }
    ],
    "2020-10-10": [
      {
        "sessions": 1000,
        "purchases": 250,
        "value": "25.00"
      }
    ]
  }
}
```

#### Net Revenue of Each Customer

Request:

```http
GET /metrics?id=net-revenue&dimensions=customer&aggregate=sum&filter.date.from=2020-09-10&filter.date.to=2020-09-15
```

Response:

```http
{
  "metric": "net-revenue",
  "dimensions": ["customer"],
  "aggregation": "sum",
  "filters": {
    "date": {
      "from": "2020-09-10",
      "to": "2020-09-15"
    }
  }
  "data": {
    "Tim": [
      {
        "value": "321.40"
      }
    ],
    "Jane": [
      {
        "value": "25.00"
      }
    ],
    "Alex": [
      {
        "value": "78.00"
      }
    ]
  }
}
```

### Extra Information

API examples and some information got from [Original Repository](https://github.com/datapadofficial/assessment-backend)

### License

Licensed with Apache 2.0, see [LICENSE](LICENSE) file for details.
