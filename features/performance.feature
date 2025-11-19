Feature: API Performance and Load

  @performance
  Scenario: Measure single request latency for games list
    Given the API base URL from fixtures endpoints
    When I request the games list
    Then the response status should be 200
    When I measure the latency of a single request to the games list
    Then the measured latency should be less than 2000 ms

  @performance
  Scenario Outline: Load test for games list
    Given the API base URL from fixtures endpoints
    When I perform a load test with concurrency <concurrency> and requests <requests>
    Then the p95 latency should be less than <p95>
    And the average latency should be less than <avg>

    Examples:
      | concurrency | requests | p95  | avg  |
      | 5           | 50       | 2000 | 1000 |
      | 10          | 100      | 3000 | 1500 |
