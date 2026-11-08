Feature: Establish a Surface workspace through the Researcher skill
  A new user can prepare durable work without understanding its internal structure.

  @installed-workspace
  Scenario: Create a workspace without beginning research
    Given a verified fresh supported Codex session with the identified skill installed
    And an empty writable destination selected by the user
    And no existing n8r workspace or prior n8r conversation
    When the user asks:
      """
      Help me set up an n8r workspace here for investigating LibreChat.
      Set it up only; do not start researching yet.
      """
    And the user answers necessary setup questions using their scenario facts
    Then a Surface workspace exists at the selected destination
    And its identity and format version are independently readable
    And the assistant identifies the actual location and how to continue
    And it distinguishes workspace creation from app project attachment
    And it does not require a Lab, source repository or Git repository
    And it does not start research or request private instance credentials
    And unrelated files and global vault settings are unchanged

  @installed-workspace
  Scenario: Repeat setup without replacing existing work
    Given the workspace has been created and contains a user-owned note
    When the user asks to set up the workspace at that location again
    Then the original workspace identity and user note remain unchanged
    And the assistant recognizes the workspace rather than recreating it

  @installed-workspace
  Scenario: Reopen without the setup conversation
    Given a fresh supported session with no access to the setup conversation
    And the user has made the created workspace available
    When the user asks:
      """
      Is this n8r workspace ready, and what can I do next?
      """
    Then the assistant recognizes the same workspace identity and format version
    And it explains the next available action from the saved workspace
    And it does not claim that LibreChat has already been researched
    And it does not start research or rewrite the workspace


  Scenario Outline: Create at an uninitialized destination
    Given the user selected a <state> writable destination
    When the user explicitly asks to set up an n8r workspace there
    Then a valid workspace identity record is created there
    And no research or unrelated configuration is created

    Examples:
      | state   |
      | missing |
      | empty   |

  Scenario: Ask before adopting an existing folder
    Given a selected folder containing a user-owned note
    And the folder has no n8r workspace metadata
    When the user asks to set up an n8r workspace there
    Then the assistant explains that existing files are present
    And asks whether to initialize there or choose another location
    And no files are changed before the user chooses

  Scenario Outline: Honor the destination choice
    Given setup paused before adopting a nonempty unrecognized folder
    When the user chooses "<choice>"
    Then the workspace is initialized at <destination>
    And the existing user-owned files remain byte-for-byte unchanged

    Examples:
      | choice                         | destination                 |
      | initialize here                | the original folder         |
      | use this other empty folder    | the newly selected folder   |

  Scenario Outline: Preserve a destination that cannot be initialized safely
    Given the selected destination contains <condition>
    When the user asks to set up an n8r workspace there
    Then the assistant explains the specific limitation and a next action
    And no files are created, changed or deleted
    And it does not claim setup succeeded or attempt repair or migration

    Examples:
      | condition                       |
      | malformed workspace metadata    |
      | conflicting .n8r contents        |
      | an unsupported workspace format |
