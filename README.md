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


NodeJS dependencies may be installed via NPM...


```Bash
npm install
```


______


## Quick Start
[heading__quick_start]:
  #quick-start
  "&#9889; Perhaps as easy as one, 2.0,..."


> Perhaps as easy as one, 2.0,...


Clone this project...


**Linux/MacOS**


```Bash
mkdir -vp ~/git/hub/solidity-utilities

cd ~/git/hub/solidity-utilities

git clone git@github.com:solidity-utilities/execution-permissions.git
```


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
