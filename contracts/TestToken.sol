pragma solidity ^0.4.15;

import './base/StandardToken.sol';
import './base/Ownable.sol';

contract TestToken is StandardToken, Ownable {
    /* constants */
    string public constant name = "TestToken";
    string public constant symbol = "TST";
    uint8 public constant decimals = 18;
    uint private constant TOKEN_LIMIT = 6000000 * (10 ** uint(decimals));
    uint private constant OWNER_MINT_LIMIT = 100000 * (10 ** uint(decimals));
    uint private constant SELF_MINT_LIMIT = 10000 * (10 ** uint(decimals));

    /* contract variables */
    mapping(address => uint) ownerMintTracker;
    mapping(address => uint) selfMintTracker;
    uint public totalOwnerMinted;
    uint public totalSelfMinted;


    function ownerMint(address _to, uint _value)
      onlyOwner()
      public
      returns (bool)
    {
      require(totalOwnerMinted.add(_value) <= TOKEN_LIMIT);
      require(ownerMintTracker[_to].add(_value) <= OWNER_MINT_LIMIT);

      balances[_to] = balances[_to].add(_value);
      ownerMintTracker[_to] = ownerMintTracker[_to].add(_value);
      totalOwnerMinted = totalOwnerMinted.add(_value);
      return true;
    }

    function selfMint(uint _value)
      public
      returns (bool)
    {
      require(totalOwnerMinted == TOKEN_LIMIT);
      require(totalSelfMinted.add(_value) <= TOKEN_LIMIT);
      require(selfMintTracker[msg.sender].add(_value) <= SELF_MINT_LIMIT);

      balances[msg.sender] = balances[msg.sender].add(_value);
      selfMintTracker[msg.sender] = selfMintTracker[msg.sender].add(_value);
      totalSelfMinted = totalSelfMinted.add(_value);
      return true;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
      require(totalOwnerMinted == TOKEN_LIMIT && totalSelfMinted == TOKEN_LIMIT);
      return super.transfer(_to, _value);
    }
}
