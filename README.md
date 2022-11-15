# Execution Permissions
[heading__top]:
  #execution-permissions
  "&#x2B06; Utility contract for setting/enforcing execution permissions per function"


Utility contract for setting/enforcing execution permissions per function


## [![Byte size of Execution Permissions][badge__main__execution_permissions__source_code]][execution_permissions__main__source_code] [![Open Issues][badge__issues__execution_permissions]][issues__execution_permissions] [![Open Pull Requests][badge__pull_requests__execution_permissions]][pull_requests__execution_permissions] [![Latest commits][badge__commits__execution_permissions__main]][commits__execution_permissions__main]   [![GitHub Actions Build Status][badge__github_actions]][activity_log__github_actions] [![License][badge__license]][branch__current__license]


---


- [:arrow_up: Top of Document][heading__top]

- [:building_construction: Requirements][heading__requirements]

- [:zap: Quick Start][heading__quick_start]

- [&#x1F9F0; Usage][heading__usage]
  - [`ExampleUsage` contract][heading__exampleusage_contract]

- [&#x1F523; API][heading__api]
  - [Contracts `ExecutionPermissions` and `IExecutionPermissions`][heading__contracts_executionpermissions_and_iexecutionpermissions]
    - [Method `isPermitted(bytes4,address)`][heading__method_ispermittedbytes4address]
    - [Method `isPermitted(string,address)`][heading__method_ispermittedstringaddress]
    - [Method `setBatchPermission(BatchPermissionEntry[])`][heading__method_setbatchpermissionbatchpermissionentry]
    - [Method `setTargetPermission(bytes4,address,bool)`][heading__method_settargetpermissionbytes4addressbool]
    - [Method `setRegistered(bool)`][heading__method_setregisteredbool]
    - [Method `setRegistered(address,bool)`][heading__method_setregisteredaddressbool]
    - [Method `tip()`][heading__method_tip]
    - [Method `withdraw(address,uint256)`][heading__method_withdrawaddressuint256]

    - [Storage `permissions(address,bytes4,address)`][heading__storage_permissionsaddressbytes4address]
    - [Storage `registered(address)`][heading__storage_registeredaddress]

- [&#x1F5D2; Notes][heading__notes]

- [:chart_with_upwards_trend: Contributing][heading__contributing]
  - [:trident: Forking][heading__forking]
  - [:currency_exchange: Sponsor][heading__sponsor]


- [:card_index: Attribution][heading__attribution]

- [:balance_scale: Licensing][heading__license]


---



## Requirements
[heading__requirements]:
  #requirements
  "&#x1F3D7; Prerequisites and/or dependencies that this project needs to function properly"


> Prerequisites and/or dependencies that this project needs to function properly


This project utilizes Truffle for organization of source code and tests, thus
it is recommended to install Truffle _globally_ to your current user account


```Bash
npm install -g truffle
```


... Or to your project root directory


```Bash
cd your_project

npm install truffle
```


______


## Quick Start
[heading__quick_start]:
  #quick-start
  "&#9889; Perhaps as easy as one, 2.0,..."


> Perhaps as easy as one, 2.0,...


NPM and Truffle are recommended for importing and managing dependencies


```Bash
cd your_project

npm install @solidity-utilities/execution-permissions
```


> Note, source code will be located within the
> `node_modules/@solidity-utilities/execution-permissions` directory of
> _`your_project`_ root


Solidity contracts may then import code via similar syntax as shown


```Solidity
import {
  ExecutionPermissions
} from "@solidity-utilities/execution-permissions/contracts/ExecutionPermissions.sol";

import {
  IExecutionPermissions,
  BatchPermissionEntry
} from "@solidity-utilities/execution-permissions/contracts/interfaces/IExecutionPermissions.sol";
```


> Note, above paths are **not** relative (ie. there's no `./` preceding the
> file path) which causes Truffle to search the `node_modules` subs-directories


Review the
[Truffle -- Package Management via NPM][truffle__package_management_via_npm]
documentation for more details.


---


> In the future, after beta testers have reported bugs and feature requests, it
> should be possible to link the deployed `ExecutionPermissions` via Truffle
> migration similar to the following.
>
>
> **`migrations/2_example_usage.js`**
>
>
>     const refExecutionPermissions = "0x0...0";
>     const ExampleUsage = artifacts.require("ExampleUsage");
>
>     module.exports = (deployer, _network, _accounts) {
>       deployer.deploy(ExampleUsage, refExecutionPermissions);
>     };


______


## Usage
[heading__usage]:
  #usage
  "&#x1F9F0; How to utilize this repository"


> How to utilize this repository


Write contract(s) that make use of, and extend, `ExecutionPermissions` features.



### `ExampleUsage` contract
[heading__exampleusage_contract]:
  #exampleusage-contract
  "Example contract that utilizes existing `ExecutionPermissions` contract"


> Example contract that utilizes existing `ExecutionPermissions` contract


```solidity
// SPDX-License-Identifier: AGPL-3.0
pragma solidity >=0.4.22 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import {
  IExecutionPermissions,
  BatchPermissionEntry
} from "@solidity-utilities/execution-permissions/contracts/interfaces/IExecutionPermissions.sol";

/// @title Example of how to utilize ExecutionPermissions features
/// @author S0AndS0
contract ExampleUsage is Ownable {
    address private _permissionStore;

    mapping(address => uint256) public account_score;

    // Store referenced to `ExecutionPermissions` contract
    constructor(address permissionStore_) Ownable() {
        _permissionStore = permissionStore_;
    }

    // Restrict execution to only permitted callers
    modifier onlyPermitted() {
        require(
            IExecutionPermissions(_permissionStore).isPermitted(
                bytes4(msg.data),
                msg.sender
            ),
            "ExampleUsage: sender not permitted"
        );
        _;
    }

    // Example of restricted function
    function setScore(uint256 value) external payable onlyPermitted {
        account_score[msg.sender] = value;
    }

    // Allow only contract owner to modify own registration state
    function setRegistered(bool state) external payable virtual onlyOwner {
        IExecutionPermissions(_permissionStore).setRegistered(state);
    }

    // Allow only contract owner to modify permissions
    function setBatchPermission(BatchPermissionEntry[] memory entries)
        external
        payable
        virtual
        onlyOwner
    {
        IExecutionPermissions(_permissionStore).setBatchPermission(entries);
    }

    // Allow only contract owner to modify permissions
    function setTargetPermission(
        bytes4 target,
        address caller,
        bool state
    ) external payable virtual onlyOwner {
        IExecutionPermissions(_permissionStore).setTargetPermission(
            target,
            caller,
            state
        );
    }
}
```


> Tip; review the `test/` sub-directory for extensive usage examples


______


## API
[heading__api]:
  #api
  "Application Programming Interfaces for Solidity smart contracts"


> Application Programming Interfaces for Solidity smart contracts


---


### Contracts `ExecutionPermissions` and `IExecutionPermissions`
[heading__contracts_executionpermissions_and_iexecutionpermissions]:
  #contracts-executionpermissions-and-iexecutionpermissions
  "Utility contract for setting/enforcing execution permissions per function"


> Utility contract for setting/enforcing execution permissions per function


**Source**

- [`contracts/ExecutionPermissions.sol`][source__contracts__executionpermissions_sol]
- [`contracts/interfaces/IExecutionPermissions.sol`][source__contracts__iexecutionpermissions_sol]


---


#### Method `isPermitted(bytes4,address)`
[heading__method_ispermittedbytes4address]:
  #method-ispermittedbytes4address
  "Check execution permissions of target function for given caller"


> Check execution permissions of target function for given caller


**Source**

- [`contracts/ExecutionPermissions.sol` -- `isPermitted(bytes4,address)`][source__contracts__executionpermissions_sol__isPermitted__bytes4_address]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `isPermitted(bytes4,address)`][source__contracts__iexecutionpermissions_sol__isPermitted__bytes4_address]


**Parameters**


- `target` **{bytes4}** Function ID to check
- `caller` **{address}** Original `msg.sender` of targeted function


**Throws** -> **{Error}** `"ExecutionPermissions: instance not registered"`


---


#### Method `isPermitted(string,address)`
[heading__method_ispermittedstringaddress]:
  #method-ispermittedstringaddress
  "Check execution permissions of target function for given caller"


> Check execution permissions of target function for given caller


**Source**

- [`contracts/ExecutionPermissions.sol` -- `isPermitted(string,address)`][source__contracts__executionpermissions_sol__isPermitted__string_address]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `isPermitted(string,address)`][source__contracts__iexecutionpermissions_sol__isPermitted__string_address]


**Parameters**


- `target` **{string}** Function signature to check
- `caller` **{address}** Original `msg.sender` of targeted function


**Throws** -> **{Error}** `"ExecutionPermissions: instance not registered"`


**Developer note** -> Note will cost more gas than
`isPermitted(bytes4,address)` due to implicit conversion of function signature
string to ID


---


#### Method `setBatchPermission(BatchPermissionEntry[])`
[heading__method_setbatchpermissionbatchpermissionentry]:
  #method-setbatchpermissionbatchpermissionentry
  "Assign multiple permission entries in one transaction"


> Assign multiple permission entries in one transaction


**Source**

- [`contracts/ExecutionPermissions.sol` -- `setBatchPermission(BatchPermissionEntry[])`][source__contracts__executionpermissions_sol__setBatchPermission__BatchPermissionEntry]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `setBatchPermission(BatchPermissionEntry[])`][source__contracts__iexecutionpermissions_sol__setBatchPermission__BatchPermissionEntry]


**Parameters**


- `BatchPermissionEntry` **{array}** entries List of permissions to assign


**Throws** -> **{Error}** `"ExecutionPermissions: instance not registered"`


**Developer note** -> Note may cost less gas due to fewer initialization
transaction fees of multiple `setTargetPermission(bytes4,address,bool)` calls


---


#### Method `setTargetPermission(bytes4,address,bool)`
[heading__method_settargetpermissionbytes4addressbool]:
  #method-settargetpermissionbytes4addressbool
  "Assign single function caller permission state"


> Assign single function caller permission state


**Source**

- [`contracts/ExecutionPermissions.sol` -- `setTargetPermission(bytes4,address,bool)`][source__contracts__executionpermissions_sol__setTargetPermission__bytes4_address_bool]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `setTargetPermission(bytes4,address,bool)`][source__contracts__iexecutionpermissions_sol__setTargetPermission__bytes4_address_bool]


**Parameters**


- `BatchPermissionEntry` **{array}** entries List of permissions to assign
- `target` **{bytes4}** Function ID to set caller permission
- `caller` **{address}** Original `msg.sender` of targeted function
- `state` **{boolean}** Value to assign for function caller interaction


**Throws** -> **{Error}** `"ExecutionPermissions: instance not registered"`


---


#### Method `setRegistered(bool)`
[heading__method_setregisteredbool]:
  #method-setregisteredbool
  "Set registration state for calling contract instance"


> Set registration state for calling contract instance


**Source**

- [`contracts/ExecutionPermissions.sol` -- `setRegistered(bool)`][source__contracts__executionpermissions_sol__setRegistered__bool]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `setRegistered(bool)`][source__contracts__iexecutionpermissions_sol__setRegistered__bool]


**Parameters**

- `state` **{boolean}** Set `true` for registered and `false` for unregistered (default)


**Throws** -> **{Error}** `"ExecutionPermissions: instance not initialized"`


---


#### Method `setRegistered(address,bool)`
[heading__method_setregisteredaddressbool]:
  #method-setregisteredaddressbool
  "Set registration state for referenced contract instance"


> Set registration state for referenced contract instance


**Source**

- [`contracts/ExecutionPermissions.sol` -- `setRegistered(bool)`][source__contracts__executionpermissions_sol__setRegistered__address_bool]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `setRegistered(bool)`][source__contracts__iexecutionpermissions_sol__setRegistered__address_bool]


**Parameters**

- `ref` **{address}** Contract instance owned by `msg.sender`
- `state` **{boolean}** Set `true` for registered and `false` for unregistered (default)


**Throws** -> **{Error}** `"ExecutionPermissions: instance not initialized"`
**Throws** -> **{Error}** `"ExecutionPermissions: instance does not implement `.owner()`"`
**Throws** -> **{Error}** `"ExecutionPermissions: not instance owner"`


---


#### Method `tip()`
[heading__method_tip]:
  #method-tip
  "Show some support developers of this contract"


> Show some support developers of this contract


**Source**

- [`contracts/ExecutionPermissions.sol` -- `tip()`][source__contracts__executionpermissions_sol__tip]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `tip()`][source__contracts__iexecutionpermissions_sol__tip]


---


#### Method `withdraw(address,uint256)`
[heading__method_withdrawaddressuint256]:
  #method-withdrawaddressuint256
  "Allow owner of `ExecutionPermissions` to receive tips"


> Allow owner of `ExecutionPermissions` to receive tips


**Source**

- [`contracts/ExecutionPermissions.sol` -- `withdraw(address,uint256)`][source__contracts__executionpermissions_sol__withdraw__address_uint256]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `withdraw(address,uint256)`][source__contracts__iexecutionpermissions_sol__withdraw__address_uint256]


**Parameters**

- `to` **{address}** Where to send Ethereum
- `amount` **{uint256}** Measured in Wei


---


#### Storage `permissions(address,bytes4,address)`
[heading__storage_permissionsaddressbytes4address]:
  #storage-permissionsaddressbytes4address
  "Check execution permissions of referenced contract function for given caller"


> Check execution permissions of referenced contract function for given caller


**Source**

- [`contracts/ExecutionPermissions.sol` -- `permissions(address,bytes4,address)`][source__contracts__executionpermissions_sol__permissions__address_bytes4_address]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `permissions(address,bytes4,address)`][source__contracts__iexecutionpermissions_sol__permissions__address_bytes4_address]


**Parameters**

- `ref` **{address}** Contract address with `target` function
- `target` **{bytes4}** Function ID to check
- `caller` **{address}** Original `msg.sender` of targeted function


---


#### Storage `registered(address)`
[heading__storage_registeredaddress]:
  #storage-registeredaddress
  "Check registration status of referenced contract"


> Check registration status of referenced contract


**Source**

- [`contracts/ExecutionPermissions.sol` -- `registered(address,bool)`][source__contracts__executionpermissions_sol__registered__address_bool]
- [`contracts/interfaces/IExecutionPermissions.sol` -- `registered(address,bool)`][source__contracts__iexecutionpermissions_sol__registered__address_bool]


**Parameters**

- `ref` **{address}** Contract address to check registration state


**Returns** -> **{boolean}** State of `ref` registration


______


## Notes
[heading__notes]:
  #notes
  "&#x1F5D2; Additional things to keep in mind when developing"


This repository may not be feature complete and/or fully functional, Pull Requests that add features or fix bugs are certainly welcomed.



______


## Contributing
[heading__contributing]:
  #contributing
  "&#x1F4C8; Options for contributing to execution-permissions and solidity-utilities"


Options for contributing to execution-permissions and solidity-utilities


---


### Forking
[heading__forking]:
  #forking
  "&#x1F531; Tips for forking execution-permissions"


Start making a [Fork][execution_permissions__fork_it] of this repository to an account that you have write permissions for.


- Add remote for fork URL. The URL syntax is _`git@github.com:<NAME>/<REPO>.git`_...


```Bash
cd ~/git/hub/solidity-utilities/execution-permissions

git remote add fork git@github.com:<NAME>/execution-permissions.git
```


- Commit your changes and push to your fork, eg. to fix an issue...


```Bash
cd ~/git/hub/solidity-utilities/execution-permissions


git commit -F- <<'EOF'
:bug: Fixes #42 Issue


**Edits**


- `<SCRIPT-NAME>` script, fixes some bug reported in issue
EOF


git push fork main
```


> Note, the `-u` option may be used to set `fork` as the default remote, eg. _`git push -u fork main`_ however, this will also default the `fork` remote for pulling from too! Meaning that pulling updates from `origin` must be done explicitly, eg. _`git pull origin main`_


- Then on GitHub submit a Pull Request through the Web-UI, the URL syntax is _`https://github.com/<NAME>/<REPO>/pull/new/<BRANCH>`_


> Note; to decrease the chances of your Pull Request needing modifications before being accepted, please check the [dot-github](https://github.com/solidity-utilities/.github) repository for detailed contributing guidelines.


---


### Sponsor
  [heading__sponsor]:
  #sponsor
  "&#x1F4B1; Methods for financially supporting solidity-utilities that maintains execution-permissions"


Thanks for even considering it!


Via Liberapay you may <sub>[![sponsor__shields_io__liberapay]][sponsor__link__liberapay]</sub> on a repeating basis.


Regardless of if you're able to financially support projects such as execution-permissions that solidity-utilities maintains, please consider sharing projects that are useful with others, because one of the goals of maintaining Open Source repositories is to provide value to the community.


______


## Attribution
[heading__attribution]:
  #attribution
  "&#x1F4C7; Resources that where helpful in building this project so far."


- [GitHub -- `github-utilities/make-readme`](https://github.com/github-utilities/make-readme)


______


## License
[heading__license]:
  #license
  "&#x2696; Legal side of Open Source"


```
Utility contract for setting/enforcing execution permissions per function
Copyright (C) 2022 S0AndS0

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```


For further details review full length version of [AGPL-3.0][branch__current__license] License.



[branch__current__license]:
  /LICENSE
  "&#x2696; Full length version of AGPL-3.0 License"

[badge__license]:
  https://img.shields.io/github/license/solidity-utilities/execution-permissions

[badge__commits__execution_permissions__main]:
  https://img.shields.io/github/last-commit/solidity-utilities/execution-permissions/main.svg

[commits__execution_permissions__main]:
  https://github.com/solidity-utilities/execution-permissions/commits/main
  "&#x1F4DD; History of changes on this branch"


[execution_permissions__community]:
  https://github.com/solidity-utilities/execution-permissions/community
  "&#x1F331; Dedicated to functioning code"


[issues__execution_permissions]:
  https://github.com/solidity-utilities/execution-permissions/issues
  "&#x2622; Search for and _bump_ existing issues or open new issues for project maintainer to address."

[execution_permissions__fork_it]:
  https://github.com/solidity-utilities/execution-permissions/fork
  "&#x1F531; Fork it!"

[pull_requests__execution_permissions]:
  https://github.com/solidity-utilities/execution-permissions/pulls
  "&#x1F3D7; Pull Request friendly, though please check the Community guidelines"

[execution_permissions__main__source_code]:
  https://github.com/solidity-utilities/execution-permissions/
  "&#x2328; Project source!"

[badge__issues__execution_permissions]:
  https://img.shields.io/github/issues/solidity-utilities/execution-permissions.svg

[badge__pull_requests__execution_permissions]:
  https://img.shields.io/github/issues-pr/solidity-utilities/execution-permissions.svg

[badge__main__execution_permissions__source_code]:
  https://img.shields.io/github/repo-size/solidity-utilities/execution-permissions


[badge__github_actions]:
  https://github.com/solidity-utilities/execution-permissions/actions/workflows/test.yaml/badge.svg?branch=main

[activity_log__github_actions]:
  https://github.com/solidity-utilities/execution-permissions/deployments/activity_log

[truffle__package_management_via_npm]:
  https://www.trufflesuite.com/docs/truffle/getting-started/package-management-via-npm
  "Documentation on how to install, import, and interact with Solidity packages"



[source__contracts__executionpermissions_sol]:
  contracts/ExecutionPermissions.sol
  "Utility contract for setting/enforcing execution permissions per function"

[source__contracts__iexecutionpermissions_sol]:
  contracts/interfaces/IExecutionPermissions.sol
  "Describe all functions available to third-parties"


[source__contracts__executionpermissions_sol__isPermitted__bytes4_address]:
  contracts/ExecutionPermissions.sol#L40
  "Insert `address` into `mapping` of `authorized` data structure"

[source__contracts__iexecutionpermissions_sol__isPermitted__bytes4_address]:
  contracts/interfaces/IExecutionPermissions.sol#L20
  "Insert `address` into `mapping` of `authorized` data structure"


[source__contracts__executionpermissions_sol__isPermitted__string_address]:
  contracts/ExecutionPermissions.sol#L52
  "Insert `address` into `mapping` of `authorized` data structure"

[source__contracts__iexecutionpermissions_sol__isPermitted__string_address]:
  contracts/interfaces/IExecutionPermissions.sol#L69
  "Insert `address` into `mapping` of `authorized` data structure"


[source__contracts__executionpermissions_sol__setBatchPermission__BatchPermissionEntry]:
  contracts/ExecutionPermissions.sol#L69
  "Assign multiple permission entries in one transaction"

[source__contracts__iexecutionpermissions_sol__setBatchPermission__BatchPermissionEntry]:
  contracts/interfaces/IExecutionPermissions.sol#L117
  "Assign multiple permission entries in one transaction"


[source__contracts__executionpermissions_sol__setTargetPermission__bytes4_address_bool]:
  contracts/ExecutionPermissions.sol#L69
  "Assign single function caller permission state"

[source__contracts__iexecutionpermissions_sol__setTargetPermission__bytes4_address_bool]:
  contracts/interfaces/IExecutionPermissions.sol#L117
  "Assign single function caller permission state"


[source__contracts__executionpermissions_sol__setRegistered__bool]:
  contracts/ExecutionPermissions.sol#L98
  "Set registration state for calling contract instance"

[source__contracts__iexecutionpermissions_sol__setRegistered__bool]:
  contracts/interfaces/IExecutionPermissions.sol#L225
  "Set registration state for calling contract instance"


[source__contracts__executionpermissions_sol__setRegistered__address_bool]:
  contracts/ExecutionPermissions.sol#L108
  "Set registration state for referenced contract instance"

[source__contracts__iexecutionpermissions_sol__setRegistered__address_bool]:
  contracts/interfaces/IExecutionPermissions.sol#L270
  "Set registration state for referenced contract instance"


[source__contracts__executionpermissions_sol__tip]:
  contracts/ExecutionPermissions.sol#L137
  "Show some support developers of this contract"

[source__contracts__iexecutionpermissions_sol__tip]:
  contracts/interfaces/IExecutionPermissions.sol#L280
  "Show some support developers of this contract"


[source__contracts__executionpermissions_sol__withdraw__address_uint256]:
  contracts/ExecutionPermissions.sol#L144
  "Allow owner of `ExecutionPermissions` to receive tips"

[source__contracts__iexecutionpermissions_sol__withdraw__address_uint256]:
  contracts/interfaces/IExecutionPermissions.sol#L314
  "Allow owner of `ExecutionPermissions` to receive tips"


[source__contracts__executionpermissions_sol__permissions__address_bytes4_address]:
  contracts/ExecutionPermissions.sol#L13
  "Check execution permissions of referenced contract function for given caller"

[source__contracts__iexecutionpermissions_sol__permissions__address_bytes4_address]:
  contracts/interfaces/IExecutionPermissions.sol#L324
  "Check execution permissions of referenced contract function for given caller"


[source__contracts__executionpermissions_sol__registered__address_bool]:
  contracts/ExecutionPermissions.sol#L20
  "Check registration status of referenced contract"

[source__contracts__iexecutionpermissions_sol__registered__address_bool]:
  contracts/interfaces/IExecutionPermissions.sol#L365
  "Check registration status of referenced contract"
