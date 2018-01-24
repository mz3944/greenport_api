# greenport_api
REST API for accessing ETH based smart contract for Greenport yourself token.

## Setup

- Install Node.js: https://nodejs.org/en/
- Install geth: https://ethereum.org/cli

- Run the following commands from the terminal:
    ```sh
    geth --testnet --rpc --rpcport=8545 console
    personal.newAccount('your_password')
    ```
    - Replace `your address` inside `index.js` file with the address you get from the above command:
        ```sh
        var adminAddress = 'your_admin_address';
        ```
    - *NOTE*: Owner of _Greenport yourself_ smart contract needs to authorize an address, in order for it to be able to write to the blockchain (use the smart contract inside it). Once you create a new account (with the above command), you need to contact the owner to authorize you.

## Run

- Run the following commands from the terminal:
    ```sh
    node index.js
    ```
- The API endpoints are accessible with the following URLs:

    - General getters:

      ```sh
        /name
        /decimals
        /users
        /balances
        /number_of_users
        /symbol
        /delta_credit_award_factor
        /registration_credits
        ```

    - General setters:

        ```sh
        /delta_credit_award_factor
        /user/assign_credits
        /registration_credits/:amount
        ```

    - User getters:

        ```sh
        /user/:address/balance
        ```

    - User setters:

        ```sh
        /user/new
        /user/:address/transfer?toAddress=:toAddress&amount=:amount
        /user/:address/admin?set=:set
        /user/:address/pos_vals?amount=:amount
        /user/:address/neg_vals?amount=:amount
        /user/:address/make_owner
       ```
