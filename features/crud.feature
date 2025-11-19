# Feature: Video Game API

#   Scenario: Get list of video games
#     Given the API base URL from fixtures endpoints
#     When I request the games list
#     Then I should receive a 200 response
#     And the response should contain a list

#   Scenario Outline: Create a new video game
#     Given the API base URL from fixtures endpoints
#     When I create a new game from fixture "games" index <index>
#     Then the response status should be 200

#     Examples:
#       | index |
#       | 0     |
#       | 1     |

#   Scenario Outline: Update an existing video game
#     Given the API base URL from fixtures endpoints
#     When I create a new game from fixture "games" index <createIndex>
#     When I update the created game using fixture "games" index <updateIndex>
#     Then the response status should be 200

#     Examples:
#       | createIndex | updateIndex |
#       | 0           | 1           |
#       | 1           | 0           |

#   Scenario Outline: Delete an existing video game
#     Given the API base URL from fixtures endpoints
#     When I create a new game from fixture "games" index <index>
#     When I delete the created game
#     Then the response status should be 200

#     Examples:
#       | index |
#       | 0     |
#       | 1     |
