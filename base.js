it('rewards investors for staking mDai tokens', async () => {
  let result

  // Check investor balance before staking
  result = await daiToken.balanceOf(investor)
  assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

  // Stake Mock DAI Tokens
  await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
  await tokenFarm.stakeTokens(tokens('100'), { from: investor })

  // Check staking result
  result = await daiToken.balanceOf(investor)
  assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

  result = await daiToken.balanceOf(tokenFarm.address)
  assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

  result = await tokenFarm.stakingBalance(investor)
  assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

  result = await tokenFarm.isStaking(investor)
  assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

  // Issue Tokens
  await tokenFarm.issueTokens({ from: owner })

  // Check balances after issuance
  result = await dappToken.balanceOf(investor)
  assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

  // Ensure that only onwer can issue tokens
  await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

  // Unstake tokens
  await tokenFarm.unstakeTokens({ from: investor })

  // Check results after unstaking
  result = await daiToken.balanceOf(investor)
  assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

  result = await daiToken.balanceOf(tokenFarm.address)
  assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

  result = await tokenFarm.stakingBalance(investor)
  assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

  result = await tokenFarm.isStaking(investor)
  assert.equal(result.toString(), 'false', 'investor staking status correct after staking')
})