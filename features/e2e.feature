Feature: Video Game API E2E

  Scenario Outline: Get list of video games
    Given the API base URL from fixtures endpoints
    When I request the games list
    Then I should receive a 200 response
    And the response should contain a list

  Scenario Outline: E2E Create - validate
    Given the API base URL from fixtures endpoints
    When I create a new game from data
      | category    | <category>    |
      | name        | <name>        |
      | rating      | <rating>      |
      | releaseDate | <releaseDate> |
      | reviewScore | <reviewScore> |
    Then the response status should be 200
    And the response should match the following JSON:
      | category    | <category>    |
      | name        | <name>        |
      | rating      | <rating>      |
      | releaseDate | <releaseDate> |
      | reviewScore | <reviewScore> |

    Examples:
      | category | name         | rating | releaseDate | reviewScore |
      | Platform | Test Game 1  | Mature | 2023-01-01  | 95          |

  Scenario Outline: E2E Update - validate
    Given the API base URL from fixtures endpoints
    When I create a new game from data
      | category    | <createCategory>    |
      | name        | <createName>        |
      | rating      | <createRating>      |
      | releaseDate | <createReleaseDate> |
      | reviewScore | <createReviewScore> |
    When I update the created game with data
      | category    | <updateCategory>    |
      | name        | <updateName>        |
      | rating      | <updateRating>      |
      | releaseDate | <updateReleaseDate> |
      | reviewScore | <updateReviewScore> |
    Then the response status should be 200
    And the response should match the following JSON:
      | category    | <updateCategory>    |
      | name        | <updateName>        |
      | rating      | <updateRating>      |
      | releaseDate | <updateReleaseDate> |
      | reviewScore | <updateReviewScore> |

    Examples:
      | createCategory | createName   | createRating | createReleaseDate | createReviewScore | updateCategory | updateName  | updateRating | updateReleaseDate | updateReviewScore |
      | Platform       | Test Game 1  | Mature       | 2023-01-01        | 95                | updated category| updated Game| updated rate| 2023-01-01        | 95                 |

  Scenario Outline: E2E Delete - validate
    Given the API base URL from fixtures endpoints
    When I create a new game from data
      | category    | <category>    |
      | name        | <name>        |
      | rating      | <rating>      |
      | releaseDate | <releaseDate> |
      | reviewScore | <reviewScore> |
    When I delete the created game
  Then the response status should be 200
  And the response should be a delete confirmation

    Examples:
      | category | name         | rating | releaseDate | reviewScore |
      | Platform | Test Game 1  | Mature | 2023-01-01  | 95          |
