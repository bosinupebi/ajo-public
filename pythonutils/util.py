import json
import os
from web3 import Web3
RPC_url = 'http://localhost:8545/'
w3 = Web3(Web3.HTTPProvider(RPC_url))
from dotenv import load_dotenv
load_dotenv()



class Constants:
    factory_abi = json.loads('[{"type":"constructor","inputs":[{"name":"_feeToSetter","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"allLotteryPools","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"allLotteryPoolsLength","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"allSavingsPools","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"allSavingsPoolsLength","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"createLotteryPool","inputs":[{"name":"contributionToken","type":"address","internalType":"address"},{"name":"contribution","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"pool","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"createSavingsPool","inputs":[{"name":"contributionToken","type":"address","internalType":"address"},{"name":"interval","type":"uint256","internalType":"uint256"},{"name":"contribution","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"pool","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"fee","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"feeTo","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"feeToSetter","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"setFee","inputs":[{"name":"_fee","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setFeeTo","inputs":[{"name":"_feeTo","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setFeeToSetter","inputs":[{"name":"_feeToSetter","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"LotteryPoolCreated","inputs":[{"name":"poolAddress","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"SavingsPoolCreated","inputs":[{"name":"poolAddress","type":"address","indexed":true,"internalType":"address"}],"anonymous":false}]')
    factory_address = '0x3d7c1ba96bACFA3022AFe4D42622f27682A6B612'
    contribution_token ='0x6c3B413C461c42a88160Ed1B1B31d6f7b02a1C83'
    private_key = os.getenv("USOPP_PRIVATE_KEY")
    pilot = '0xcC6f247ee663059D04C17955fb838Cf9ac61a37e'
    lottery_pool_address = '0xe6D1d2734B177b38095793A1237b7f66d8A15C2B'
    er20_abi = json.loads(
        '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]'
    )
    lottery_pool_abi = json.loads('[{"type":"constructor","inputs":[{"name":"_contributionToken","type":"address","internalType":"address"},{"name":"_contribution","type":"uint256","internalType":"uint256"},{"name":"_creator","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"contractBalance","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"contribution","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"contributionToken","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"contributionTokenName","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"creator","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"factory","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"join","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"payout","inputs":[{"name":"_luckyPhrase","type":"string","internalType":"string"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"rageQuit","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"tokenBalancesByUser","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"contract IERC20"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"uniqueAddresses","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"event","name":"FeePaid","inputs":[{"name":"feeTo","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"FeePaid","inputs":[{"name":"feeTo","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Join","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Payout","inputs":[{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Sync","inputs":[{"name":"balance","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}]')



factory = w3.eth.contract(address=Constants.factory_address, abi = Constants.factory_abi)


def get_all_savings_pool_length():

    savings_pool_length = factory.functions.allSavingsPoolsLength().call()

    return savings_pool_length

def get_all_lottery_pool_length():

    lottery_pool_length = factory.functions.allLotteryPoolsLength().call()

    return lottery_pool_length

def get_fee_to():

    fee_to = factory.functions.feeTo().call()

    return fee_to

def get_fee_to_setter():

    fee_to_setter = factory.functions.feeToSetter().call()

    return fee_to_setter

def get_fee():

    fee = factory.functions.fee().call()

    return fee

def build_and_send_transaction(transaction_object, account_address, gas_price =int(1000000000)):
    
    nonce = w3.eth.get_transaction_count(account_address)
    
    gas = estimate_gas(transaction_object, gas_price, nonce, account_address)
     
    tx = transaction_object.build_transaction({
        'from': account_address,
        'gas' : int(gas),
        'gasPrice': gas_price,
        'nonce': nonce,
        })

    signed_tx = w3.eth.account.sign_transaction(tx, Constants.private_key)
    
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    
    return tx_hash

def estimate_gas(transaction_object, gas_price, nonce, from_address):
    
    estimate = None
    
    try:
        estimate = transaction_object.estimate_gas({
        'from': str(from_address),
        'gasPrice': int(gas_price),
        'nonce': nonce, 
        'value': int(0)
        })
    except Exception as e:
        pass
    
    return estimate

def create_lottery_pool():

    pool = factory.functions.createLotteryPool(Constants.contribution_token, int(100000))

    hash = build_and_send_transaction(pool, Constants.pilot)

    return hash

def transfer_token_to_pool():

    token = w3.eth.contract(address=Constants.factory_address, abi = Constants.er20_abi)

    pool = factory.functions.createLotteryPool(Constants.contribution_token, int(100000))

    hash = build_and_send_transaction(pool, Constants.pilot)

    return hash

def get_unique_address_length():
    pool = w3.eth.contract(address=Constants.lottery_pool_address, abi = Constants.lottery_pool_abi)

    length = pool.functions.uniqueAddresses(0).call()  

    print(length)


if __name__ == "__main__":
    get_unique_address_length()
    #pass