@ui
Feature: SauceDemo successful login

    Scenario Outline: Successful login user journey with valid credentials
        Given the SauceDemo login page is displayed
        When the username "<username>" and password "<password>" are entered
        And the login button is clicked
        Then the inventory page should be displayed

        Examples:
        | username      | password     |
        | standard_user | secret_sauce |
        | visual_user   | secret_sauce |        
