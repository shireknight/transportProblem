***** Read Me file for Quoin, Inc. Coding Exercise. *****
  Author: Ben Valentine
  Client: Quoin, Inc.
  Version: 1.0
  Description: A command line interface that issues and redeems
  passes for a public transportation system.

Dependencies:
  node.js

* Command line interface. Gathers data from user input.

* Other node modules are listed package.json. Should be added on install.
I tried to keep dependencies to a minimum.

* Purchasing functionality is nearly complete, redeem still has some bugs.

* Fairs and discounts are listed in 'json/fairs.json'.
* Discounts are listed as the percentage of the normal fair.
* Prepaid rates are listed per ride.

* Data is written to persons and passes files.

## Roadmap

  * Completed for Sprint #1:

    1. Completed user workflow for purchasing a pass.

    2. Partially completed workflow for using/redeeming a pass.

    3. Made json file for editing fairs + discounts.

    4. Json files for storing pass and person data.

  * For Sprint #2:

    1. Finish redeem workflow. Add balance to prepaid passes. Lower balance after user redeems.

    2. Validation for name.

    3. Add credit card entry to purchases.

    4. Possibly integrate social security # for users.

    5. * Bugs *


  * For Sprint #3:

    1. Add unique hashes for Person and Pass objects.

    2. Add Credit Card encryption.

    3. Check purchase date on monthly passes before redeeming.

    4. MongoDB?

    5. * Bugs *
